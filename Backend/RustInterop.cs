using System;
using System.Runtime.InteropServices;

public static class RustInterop
{
    private const string LIB_NAME = "librust_lib";  // No .dylib extension

    [DllImport(LIB_NAME, CallingConvention = CallingConvention.Cdecl)]
    public static extern int add_numbers(int a, int b);
}
