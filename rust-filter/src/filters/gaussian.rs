use std::f64::consts::{E, PI};

fn get_kernel(size: usize) -> Vec<Vec<f64>> {
    let sigma = 10.0_f64;
    let size = 2 * size + 1; // Make it always odd so there's always a center element
    let mut total = 0.0;
    let mut kernel: Vec<Vec<f64>> = Vec::with_capacity(size);

    for x in 0..size {
        kernel.push(Vec::with_capacity(size));

        for y in 0..size {
            kernel[x].push(
                1.0 / (2.0 * PI * sigma.powi(2))
                    * E.powf(-1.0 * (x as f64).powi(2) * (y as f64).powi(2) / 2.0 * sigma.powi(2)),
            );

            total += kernel[x][y];
        }
    }

    for x in 0..size {
        for y in 0..size {
            kernel[x][y] /= total;
        }
    }

    kernel
}

pub fn gaussian(data: &[u8], width: usize, height: usize, size: usize) -> Vec<u8> {
    let normalized = data.to_vec()
        .iter()
        .map(|byte| (byte.clone() as f64) / 255.0)
        .collect::<Vec<f64>>();

    let mut blurred = data.to_vec();

    let kernel = get_kernel(size);
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
