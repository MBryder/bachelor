public class RustTspSolver : ITspSolver
{
    public int Solve(int n, IntPtr distMatrix, IntPtr routeBuffer)
    {
        return RustInterop.HeldKarpTSPFull(n, distMatrix, routeBuffer);
    }
}
