using System;
using System.Runtime.InteropServices;
using System.Runtime.CompilerServices;

public static class RustInterop
{
    private static readonly string LIB_NAME = GetLibraryName();

    private static string GetLibraryName()
    {
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            return "rust_lib.dll";
        }
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
        {
            return "librust_lib.dylib";
        }
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
        {
            return "librust_lib.so";
        }
        throw new PlatformNotSupportedException("Unsupported operating system");
    }

    [DllImport("rust_lib", CallingConvention = CallingConvention.Cdecl, EntryPoint = "add_numbers")]
    public static extern int add_numbers(int a, int b);
}
