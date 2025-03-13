use std::collections::HashMap;
use std::cmp::min;
use std::ptr;

#[no_mangle]
pub extern "C" fn add_numbers(a: i32, b: i32) -> i32 {
    a + b
}

#[no_mangle]
pub extern "C" fn multiply_numbers(a: i32, b: i32) -> i32 {
    a * b
}

// Shortest path TSP held karp returning both cost and optimal route
#[no_mangle]
pub extern "C" fn held_karp_tsp_full(n: usize, dist_ptr: *const i32, route_ptr: *mut i32) -> i32 {
    if dist_ptr.is_null() || route_ptr.is_null() {
        return -1; // Error case
    }

    // Convert the raw pointer to a slice
    let dist_slice = unsafe { std::slice::from_raw_parts(dist_ptr, n * n) };

    // Convert the flat slice into a 2D Vec<Vec<i32>>
    let mut dist = vec![vec![0; n]; n];
    for i in 0..n {
        for j in 0..n {
            dist[i][j] = dist_slice[i * n + j];
        }
    }

    let mut memo = HashMap::new();
    let mut parent = HashMap::new();

    // Solve TSP
    let min_cost = tsp_held_karp(0, 1, n, &dist, &mut memo, &mut parent);

    // Reconstruct the path
    let mut path = vec![0; n + 1];
    let mut visited = 1;
    let mut pos = 0;

    for i in 1..n {
        if let Some(&next_city) = parent.get(&(pos, visited)) {
            path[i] = next_city as i32;
            visited |= 1 << next_city;
            pos = next_city;
        }
    }
    path[n] = 0; // Return to start

    // Copy the route to the provided pointer
    unsafe {
        ptr::copy_nonoverlapping(path.as_ptr(), route_ptr, n + 1);
    }

    min_cost
}

fn tsp_held_karp(
    pos: usize,
    visited: usize,
    n: usize,
    dist: &Vec<Vec<i32>>,
    memo: &mut HashMap<(usize, usize), i32>,
    parent: &mut HashMap<(usize, usize), usize>,
) -> i32 {
    if visited == (1 << n) - 1 {
        return dist[pos][0];
    }

    if let Some(&res) = memo.get(&(pos, visited)) {
        return res;
    }

    let mut min_cost = i32::MAX;
    let mut best_next = None;

    for next in 0..n {
        if visited & (1 << next) == 0 {
            let new_visited = visited | (1 << next);
            let cost = dist[pos][next] + tsp_held_karp(next, new_visited, n, dist, memo, parent);

            if cost < min_cost {
                min_cost = cost;
                best_next = Some(next);
            }
        }
    }

    memo.insert((pos, visited), min_cost);
    if let Some(next_city) = best_next {
        parent.insert((pos, visited), next_city);
    }

    min_cost
}