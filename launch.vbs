Set WshShell = CreateObject("WScript.Shell")
scriptDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = scriptDir

Function ServerIsRunning()
    On Error Resume Next
    Dim http
    ServerIsRunning = False
    Set http = CreateObject("WinHttp.WinHttpRequest.5.1")
    http.SetTimeouts 500, 500, 800, 800
    http.Open "GET", "http://127.0.0.1:8793/index.html", False
    http.Send
    If Err.Number = 0 And http.Status = 200 Then
        ServerIsRunning = True
    End If
    Err.Clear
    On Error Goto 0
End Function

If Not ServerIsRunning() Then
    WshShell.Run "pythonw.exe " & Chr(34) & scriptDir & "\server.py" & Chr(34), 0, False
    WScript.Sleep 1500
End If

WshShell.Run "http://127.0.0.1:8793/index.html"
