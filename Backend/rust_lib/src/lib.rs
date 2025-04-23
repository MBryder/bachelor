use std::collections::HashMap;
use itertools::Itertools;
use std::slice;
use std::ptr;


#[no_mangle]
pub extern "C" fn add_numbers(a: i32, b: i32) -> i32 {
    a + b
}

#[no_mangle]
pub extern "C" fn multiply_numbers(a: i32, b: i32) -> i32 {
    a * b
}

#[no_mangle]
pub extern "C" fn held_karp_tsp_full(n: usize, dist_ptr: *const i32, route_ptr: *mut i32) -> i32 {
    let dist_slice = unsafe { std::slice::from_raw_parts(dist_ptr, n * n) };
    let mut dist: Vec<Vec<i32>> = vec![vec![0; n]; n];
    for i in 0..n {
        for j in 0..n {
            dist[i][j] = dist_slice[i * n + j];
        }
    }

    let mut subproblemsolutions = std::collections::HashMap::new();
    compute_base_case(&mut subproblemsolutions, &dist);
    compute_min_cost(&mut subproblemsolutions, &dist);

    let (final_cost, path) = return_to_start_and_backtrack(&subproblemsolutions, &dist);

    unsafe {
        for (i, &city) in path.iter().enumerate() {
            *route_ptr.add(i) = city as i32;
        }
    }

    final_cost
}


fn compute_base_case(
    subproblemsolutions: &mut HashMap<(u64, usize), (i32, usize)>,
    dist: &Vec<Vec<i32>>,
) {
    let n = dist.len();
    for city in 1..n {
        let mask = 1 << city;
        let cost = dist[0][city];
        subproblemsolutions.insert((mask, city), (cost, 0));
    }
}

fn compute_min_cost(
    subproblemsolutions: &mut HashMap<(u64, usize), (i32, usize)>,
    dist: &Vec<Vec<i32>>,
) {
    let n = dist.len();
    for subset_size in 2..n {
        for combo in (1..n).combinations(subset_size) {
            let mask = combo.iter().fold(0u64, |acc, &c| acc | (1 << c));
            for &last_city in &combo {
                let prev_mask = mask & !(1 << last_city);
                let mut min_cost = i32::MAX;
                let mut best_prev_city = 0;

                for &prev_city in &combo {
                    if prev_city == last_city {
                        continue;
                    }
                    if let Some(&(cost_to_prev, _)) =
                        subproblemsolutions.get(&(prev_mask, prev_city))
                    {
                        let total_cost = cost_to_prev + dist[prev_city][last_city];
                        if total_cost < min_cost {
                            min_cost = total_cost;
                            best_prev_city = prev_city;
                        }
                    }
                }

                subproblemsolutions.insert((mask, last_city), (min_cost, best_prev_city));
            }
        }
    }
}

fn return_to_start_and_backtrack(
    subproblemsolutions: &HashMap<(u64, usize), (i32, usize)>,
    dist: &Vec<Vec<i32>>,
) -> (i32, Vec<usize>) {
    let n = dist.len();
    let full_mask = (1 << n) - 2;
    let mut min_total_cost = i32::MAX;
    let mut final_last_city = 0;

    for last_city in 1..n {
        if let Some(&(cost, _)) = subproblemsolutions.get(&(full_mask, last_city)) {
            let total_cost = cost + dist[last_city][0];
            if total_cost < min_total_cost {
                min_total_cost = total_cost;
                final_last_city = last_city;
            }
        }
    }

    let mut path = vec![0];
    let mut mask = full_mask;
    let mut last_city = final_last_city;

    path.push(last_city);
    while mask != 0 {
        let &(_, prev_city) = subproblemsolutions.get(&(mask, last_city)).unwrap();
        if prev_city == 0 {
            break;
        }
        path.push(prev_city);
        mask &= !(1 << last_city);
        last_city = prev_city;
    }

    path.push(0);
    path.reverse();
    (min_total_cost, path)
}
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add_numbers(1, 2), 3);
    }


#[test]
    fn test_multiply_numbers() {
        assert_eq!(multiply_numbers(4, 5), 20);
    }
#[test]
    fn test_held_karp_tsp() {
        let dist_matrix = vec![
            0, 10, 15, 20,
            10, 0, 35, 25,
            15, 35, 0, 30,
            20, 25, 30, 0
        ];

        let mut route = vec![0; 5]; // 5 slots for 0 → ... → 0
        let result = held_karp_tsp_full(4, dist_matrix.as_ptr(), route.as_mut_ptr());

        // Expected cost for optimal TSP on this graph is 80
        assert_eq!(result, 80);

        // Optional: assert expected path if deterministic (may vary in tie cases)
        assert_eq!(route[..5], [0, 2, 3, 1, 0]);
    }
}