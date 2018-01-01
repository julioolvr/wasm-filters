use std::slice;
use std::mem;
use std::os::raw::c_void;

pub mod filters;

#[no_mangle]
pub fn blur(data: *const u8, width: usize, height: usize) -> *const u8 {
    let jpg_data;

    unsafe {
        jpg_data = slice::from_raw_parts(data, width * height * 4);
    }

    let blurred = filters::gaussian(jpg_data, width, height);
    let ptr = blurred.as_ptr();
    mem::forget(blurred);

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
