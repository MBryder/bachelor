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
    #[test]
    fn test_two_cities() {
        let dist_matrix = vec![
            0, 5,
            5, 0
        ];
    
        let mut route = vec![0; 3]; // 0 → 1 → 0
        let result = held_karp_tsp_full(2, dist_matrix.as_ptr(), route.as_mut_ptr());
    
        assert_eq!(result, 10);
        assert_eq!(route[..3], [0, 1, 0]);
    }
    
    #[test]
    fn test_three_cities_symmetric() {
        let dist_matrix = vec![
            0, 10, 15,
            10, 0, 20,
            15, 20, 0
        ];
    
        let mut route = vec![0; 4]; // 0 → ... → 0
        let result = held_karp_tsp_full(3, dist_matrix.as_ptr(), route.as_mut_ptr());
    
        assert_eq!(result, 45);
        assert_eq!(route[..4], [0, 2, 1, 0]);
    }
    
    #[test]
    fn test_three_cities_asymmetric() {
        let dist_matrix = vec![
            0, 5, 9,
            4, 0, 8,
            3, 7, 0
        ];
    
        let mut route = vec![0; 4];
        let result = held_karp_tsp_full(3, dist_matrix.as_ptr(), route.as_mut_ptr());
    
        assert_eq!(result, 16); // 0 → 2 → 1 → 0 is optimal (9 + 7 + 1)
        assert_eq!(route[..4], [0, 1, 2, 0]);
    }
    
    #[test]
    fn test_four_cities_equal_distances() {
        let dist_matrix = vec![
            0, 1, 1, 1,
            1, 0, 1, 1,
            1, 1, 0, 1,
            1, 1, 1, 0
        ];
    
        let mut route = vec![0; 5];
        let result = held_karp_tsp_full(4, dist_matrix.as_ptr(), route.as_mut_ptr());
    
        assert_eq!(result, 4);
        assert_eq!(route[0], 0);
        assert_eq!(route[4], 0);
        assert_eq!(route[1..4].iter().copied().collect::<std::collections::HashSet<_>>().len(), 3); // all intermediate cities are unique
    }
    
    #[test]
    fn test_five_cities_varied_distances() {
        let dist_matrix = vec![
            0, 2, 9, 10, 1,
            1, 0, 6, 4, 7,
            15, 7, 0, 8, 3,
            6, 3, 12, 0, 9,
            8, 5, 6, 13, 0
        ];
    
        let mut route = vec![0; 6];
        let result = held_karp_tsp_full(5, dist_matrix.as_ptr(), route.as_mut_ptr());
    
        assert_eq!(result, 19);
        assert_eq!(route[0], 0);
        assert_eq!(route[5], 0);
        assert_eq!(route[1..5].iter().copied().collect::<std::collections::HashSet<_>>().len(), 4); // all intermediate cities are unique
    }
    