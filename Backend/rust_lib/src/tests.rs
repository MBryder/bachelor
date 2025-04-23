use crate::*; // bring in public items from lib.rs


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

        
        assert_eq!(result, 80);

        
        assert_eq!(route[..5], [0, 2, 3, 1, 0]);
    }
