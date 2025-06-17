namespace WarShipsX.Application.Modules.Common.Services;

public class AwaitableTaskService
{
    public async Task AwaitTask(TimeSpan taskTime, Action taskCancelledFn, Action timePassedFn, Action afterTaskFn, CancellationToken ct)
    {
        try
        {
            await Task.Delay(taskTime, ct);

            timePassedFn();
        }
        catch (TaskCanceledException)
        {
            taskCancelledFn();
        }
        finally
        {
            afterTaskFn();
        }
    }
}
