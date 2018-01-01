fn get_kernel() -> Vec<Vec<f64>> {
    vec![
        vec![
            1.0 / 273.0,
            4.0 / 273.0,
            7.0 / 273.0,
            4.0 / 273.0,
            1.0 / 273.0,
        ],
        vec![
            4.0 / 273.0,
            16.0 / 273.0,
            26.0 / 273.0,
            16.0 / 273.0,
            4.0 / 273.0,
        ],
        vec![
            7.0 / 273.0,
            26.0 / 273.0,
            41.0 / 273.0,
            26.0 / 273.0,
            7.0 / 273.0,
        ],
        vec![
            4.0 / 273.0,
            16.0 / 273.0,
            26.0 / 273.0,
            16.0 / 273.0,
            4.0 / 273.0,
        ],
        vec![
            1.0 / 273.0,
            4.0 / 273.0,
            7.0 / 273.0,
            4.0 / 273.0,
            1.0 / 273.0,
        ],
    ]
}

pub fn gaussian(data: &[u8], width: usize, height: usize) -> Vec<u8> {
    let normalized = data.to_vec()
        .iter()
        .map(|byte| (byte.clone() as f64) / 255.0)
        .collect::<Vec<f64>>();

    let mut blurred = data.to_vec();

    let kernel = get_kernel();
    let kernel_size = kernel.len() as i64;

    for i in 0..(width * height) {
        let alpha = normalized[i * 4 + 3];

        let row = (i / width) as i64;
        let column = (i % width) as i64;
        let height = height as i64;
        let width = width as i64;

        let mut blurred_r = 0.0;
        let mut blurred_g = 0.0;
        let mut blurred_b = 0.0;

        for (x, kernel_row) in kernel.iter().enumerate() {
            for (y, val) in kernel_row.iter().enumerate() {
                let x = x as i64 - kernel_size / 2;
                let y = y as i64 - kernel_size / 2;

                if row + x >= 0 && row + x < height && column + y >= 0 && column + y < width {
                    let index = ((row + x) * width + column + y) * 4;
                    blurred_r += normalized[index as usize] * val;
                    blurred_g += normalized[(index + 1) as usize] * val;
                    blurred_b += normalized[(index + 2) as usize] * val;
                }
            }
        }

        blurred[i * 4] = (blurred_r * 255.0) as u8;
        blurred[i * 4 + 1] = (blurred_g * 255.0) as u8;
        blurred[i * 4 + 2] = (blurred_b * 255.0) as u8;
        blurred[i * 4 + 3] = (alpha * 255.0) as u8;
    }

    blurred
}
