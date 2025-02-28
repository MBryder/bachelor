# bachelor

# Run backend "dotnet run"

# Run frontend "npm start"




# RUST BAD BOY

## Why?
We need some way of doing heavy calculations fast and efficiently. So first up, you will need a Rust compiler.

You can use **any Rust compiler**, it should work regardless. Since we want to call the Rust functions inside our backend via **C#**, we need to have the Rust component as a **dynamic library**.

---

## What is a dynamic library?
> "A dynamic Rust library is a shared library compiled from Rust code that can be loaded at runtime by other programs, enabling inter-language interoperability."

---

## How is this done in this project? :D

We have a directory inside the backend, called **rust_lib**, which contains the source code for our Rust logic. Currently, there is only a simple addition function inside `lib.rs`:

```rust
#[no_mangle]
pub extern "C" fn add_numbers(a: i32, b: i32) -> i32 {
    a + b
}
```

It's very simple, but it has some crucial syntax, which is pretty cool. Let's go through it together:

- The first line **`#[no_mangle]`** says that Rust **is not allowed** to change the name of the function during compilation. This is very useful when calling the function from other languages. Since we have linked Rust with **C#**, this is awesome.

---

## How to bridge the gap between C# and Rust

The file **RustInterop.cs** acts as a **bridge** between the C# code and the dynamic Rust library.

```csharp
using System;
using System.Runtime.InteropServices;

public static class RustInterop
{
    private const string LIB_NAME = "librust_lib";  // No .dylib extension

    [DllImport(LIB_NAME, CallingConvention = CallingConvention.Cdecl)]
    public static extern int add_numbers(int a, int b);
}
```

### Line-by-line breakdown:
1. **`using System;`** → Imports fundamental classes and base functionality from .NET.
2. **`using System.Runtime.InteropServices;`** → Imports classes for interoperability, which is required for `[DllImport]`.
3. **`public static class RustInterop`** → Declares a static class, so we don't need to instantiate it.
4. **`private const string LIB_NAME = "librust_lib";`** → Defines a private string holding our library name **without the file extension**. This will be resolved at runtime depending on the operating system, so **Sigurd** can also compile on Windows seamlessly.
5. **`[DllImport(LIB_NAME, CallingConvention = CallingConvention.Cdecl)]`** →
   - Specifies that the following function is from an external library.
   - Uses `LIB_NAME` to determine the correct library file.
   - Follows the **C calling convention (Cdecl)**, which is important for ensuring function calls are handled correctly between Rust and C#.
6. **`public static extern int add_numbers(int a, int b);`** →
   - Declares an external function that exists in Rust.
   - Uses `extern` to show that it's not implemented in C#.

So, this file acts as the **bridge** between the C# code and the Rust code, allowing us to call Rust functions from C#.

---

## API Endpoints: Triggering Rust Code via an API Request

```csharp
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]  // Matches `/api/rust/`
[ApiController]
public class RustController : ControllerBase
{
    [HttpGet("add")]
    public IActionResult AddNumbers([FromQuery] int a, [FromQuery] int b)
    {
        int result = RustInterop.add_numbers(a, b);
        return Ok(new { sum = result });
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new { message = "API is working" });
    }
}
```

The **interesting** part here is the line:

```csharp
int result = RustInterop.add_numbers(a, b);
```

This uses `RustInterop`, and in this way, we can trigger the Rust code **from the API** and, of course, get a result back. **Pretty cool, right?** 😎

---

## How to compile my Rust code with .NET? And what should I do? 🤔

Don't worry, I've got you covered! There is a block of code inside **MyBackend.csproj** that takes care of it:

```xml
<Target Name="BuildRustLib" BeforeTargets="Build">
    <Exec Command="cargo build --release" WorkingDirectory="rust_lib" />
    <Copy SourceFiles="rust_lib/target/release/librust_lib.dylib"
          DestinationFolder="bin/Debug/net9.0/"
          Condition="'$(OS)' != 'Windows_NT'" />
    <Copy SourceFiles="rust_lib/target/release/rust_lib.dll"
          DestinationFolder="bin/Debug/net9.0/"
          Condition="'$(OS)' == 'Windows_NT'" />
</Target>
```

### What does this do?
1. **`cargo build --release`** → Builds the Rust library in release mode.
2. **Copies the compiled Rust library to the .NET output directory.**
   - **For macOS/Linux:** Uses `librust_lib.dylib` (or `.so` for Linux).
   - **For Windows:** Uses `rust_lib.dll`.
3. **The conditional logic ensures compatibility across operating systems.**
   - Sigurd's **trash operating system** (Windows) won't cause problems. 😂

### So what do you need to do?
- Just **run `dotnet build`**, and everything will be compiled and copied automatically! 🎉

---

## Final Thoughts
With this setup:
- Rust handles the **heavy computations**.
- C# acts as a **bridge** via `RustInterop.cs`.
- The API **exposes Rust functions** through `RustController.cs`.
- The `.NET build process** takes care of compiling Rust automatically.

So all happy days! **Have fun Rust coding, boys!** 🚀🔥

