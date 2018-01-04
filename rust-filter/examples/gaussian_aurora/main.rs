#![feature(iterator_step_by)]

// Importing the crate will fail since the target is cdylib (in order
// to be able to compile it to WASM) and that the output that generates
// cannot be imported. In order to be able to import it, I need to generate
// a separate crate type, like rlib.
// BUT LTO[1] cannot be used for rlib crates. And the WASM target requires
// it[2]. Cargo only runs rustc once regardless of the number of crate-types,
// and it will fail building the rlib crate since LTO is enabled because of
// WASM[3].
//
// THEREFORE, in order to run this example, go to Cargo.toml and temporarily
// remove the line that specifies the crate-type as cdylib. The default should
// work fine.
//
// [1]: https://lifthrasiir.github.io/rustlog/why-is-a-rust-executable-large.html
// [2]: https://github.com/rust-lang/rust/pull/45905/files#diff-7c71ed658fcf44324d22bed732713dbcR11
// [3]: https://github.com/rust-lang/cargo/issues/2301
extern crate filter;
extern crate image;

use image::GenericImage;

fn main() {
    let img = image::open("./examples/gaussian_aurora/aurora.jpg").unwrap();
    let rgb_img = img.to_rgb().into_raw();
    let mut rgb_img = rgb_img
        .iter()
        .enumerate()
        .step_by(3)
        .map(|(i, _)| [rgb_img[i], rgb_img[i + 1], rgb_img[i + 2]])
        .collect();

    filter::filters::gaussian(
        &mut rgb_img,
        img.width() as usize,
        img.height() as usize,
        5.0,
    );

    let mut result = Vec::with_capacity((img.width() * img.height() * 3) as usize);
    rgb_img.into_iter().for_each(|pixel| {
        result.push(pixel[0]);
        result.push(pixel[1]);
        result.push(pixel[2]);
    });

    image::save_buffer(
        "./examples/gaussian_aurora/blurred.jpg",
        &result,
        img.width(),
        img.height(),
        image::RGB(8),
    ).unwrap();
}
