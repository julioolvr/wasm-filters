pub fn gaussian(data: &[u8], width: usize, height: usize) -> Vec<u8> {
    let mut blurred = data.to_vec();

    for (i, byte) in data.iter().enumerate() {
        blurred[i] = 0;
    }

    blurred
}
