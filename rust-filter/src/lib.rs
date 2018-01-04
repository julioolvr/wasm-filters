use std::slice;
use std::mem;
use std::os::raw::c_void;

pub mod filters;

#[no_mangle]
pub fn blur(data: *mut [u8; 3], width: usize, height: usize, size: f32) -> *const [u8; 3] {
    let jpg_data;

    unsafe {
        jpg_data = slice::from_raw_parts(data, width * height);
    }

    let mut jpg_data = jpg_data.to_vec();

    filters::gaussian(&mut jpg_data, width, height, size);
    let ptr = jpg_data.as_ptr();

    ptr
}

#[no_mangle]
pub fn alloc(size: usize) -> *const c_void {
    let buf = Vec::with_capacity(size);
    let ptr = buf.as_ptr();
    mem::forget(buf);
    ptr
}

#[no_mangle]
pub fn dealloc(ptr: *mut c_void, cap: usize) {
    unsafe {
        let _buf = Vec::from_raw_parts(ptr, 0, cap);
    }
}
