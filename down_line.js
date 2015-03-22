// -----------------------------------------------------------------------------
// down_line.js
//
// -----------------------------------------------------------------------------

//linemode([1,1,0,0]); Top, Bottom, Left, Right
function linemode(ary) {
    switch (ary.toString()) {
    case "0,0,0,0":
        return "";
    case "0,0,0,1":
        return "";
    case "0,0,1,0":
        return "";
        break;
    case "0,0,1,1":
        return "─";
        break;
    case "0,1,0,0":
        return "";
        break;
    case "0,1,0,1":
        return "┌";
        break;
    case "0,1,1,0":
        return "┐";
        break;
    case "0,1,1,1":
        return "┬";
        break;
    case "1,0,0,0":
        return "";
        break;
    case "1,0,0,1":
        return "└";
        break;
    case "1,0,1,0":
        return "┘";
        break;
    case "1,0,1,1":
        return "┴";
        break;
    case "1,1,0,0":
        return "│";
        break;
    case "1,1,0,1":
        return "├";
        break;
    case "1,1,1,0":
        return "┤";
        break;
    case "1,1,1,1":
        return "┼";
        break;
    default:
	alert("Error NG");
	return;
        break;
    }
}

var top_joint    = ["│", "┼", "┌", "┐", "├", "┬", "┤", "┃", "╋", "┏", "┓", "┣", "┳", "┫"];
var bottom_joint = ["│", "┼", "┘", "└", "├", "┤", "┴", "┃", "╋", "┛", "┗", "┣", "┫", "┻"];
var left_joint   = ["─", "┼", "┌", "└", "├", "┬", "┴", "━", "╋", "┏", "┗", "┣", "┳", "┻"];
var right_joint  = ["─", "┼", "┘", "┐", "┬", "┤", "┤", "━", "╋", "┛", "┓", "┳", "┫", "┫"];

var s = linemode([1,1,0,0]);
//var y = document.selection.GetActivePointY(mePosView);
//var now_s = document.GetLine(y);
alert(s);
//document.selection.Text = s.join("\n");
//document.selection.DestructiveInsert(now_s + s);
document.Write(s);
//document.selection.StartOfDocument();

DrawLine("Bottom");

function DrawLine(direct){
    var ln;
    var defchar;
    switch (direct) {
    case "Bottom":
          ln = linemode([IsStrMatch(GetTop(), top_joint), 1, IsStrMatch(GetLeft(), left_joint), IsStrMatch(GetRight(), right_joint)]);
          defchar = "│";
          break;
    case "Top":
          ln = linemode([1, IsStrMatch(GetBottom(), bottom_joint), IsStrMatch(GetLeft(), left_joint), IsStrMatch(GetRight(), right_joint)]);
          defchar = "│";
          break;
    case "Left":
          ln = linemode([IsStrMatch(GetTop(), top_joint), IsStrMatch(GetBottom(), bottom_joint), 1, IsStrMatch(GetRight(), right_joint)]);
          defchar = "─";
          break;
    case "Right":
          ln = linemode([IsStrMatch(GetTop(), top_joint), IsStrMatch(GetBottom(), bottom_joint), IsStrMatch(GetLeft(), left_joint), 1]);
          defchar = "─";
          break;
    default:
	alert("Error NG");
	return;
        break;
    }
    if (ln == "") {
    ln = defchar;
    }
    InsertText(ln);
    switch (direct) {
    case "Bottom":
          if ( MoveBottom() == false) {
          return;
          }
          break;
    case "Top":
          if ( MoveTop() == false) {
          return;
          }
          break;
    case "Left":
          if ( MoveLeft() == false) {
          return;
          }
          break;
    case "Right":
          if ( MoveRight() == false) {
          return;
          }
          break;
    default:
	alert("Error NG");
	return;
        break;
    }
    InsertText(linemode([IsStrMatch(GetTop(), top_joint), IsStrMatch(GetBottom(), bottom_joint), IsStrMatch(GetLeft(), left_joint), IsStrMatch(GetRight(), right_joint)]));


}

function GetCur() {
    var now_view_x = document.selection.GetActivePointX(mePosView);
    var now_view_y = document.selection.GetActivePointY(mePosView);
    var line_str = GetLineStr(now_view_y);
    if ((now_view_x - 1) >= ByteLen(line_str)) {
	return;
    }
    return line_str.charAt(now_view_x - 1);
}

function GetTop() {
    return GetTopOrBottom("Top");
}

function GetBottom() {
    return GetTopOrBottom("Bottom");
}

function GetTopOrBottom(direct) {
    var ret = "";
    var now_view_x = document.selection.GetActivePointX(mePosView);
    var now_view_y = document.selection.GetActivePointY(mePosView);
    var dst_str;
    switch (direct) {
	case "Top":
	    if (now_view_y == 1) {
		return ret;
	    }
	    dst_str = GetLineStr(now_view_y - 1);
	    break;
	case "Bottom":
	    if (IsFinalLine(now_view_y)) {
		return ret;
	    }
	    dst_str = GetLineStr(now_view_y + 1);
	    break;
	default:
	    alert("Error NG");
	    return;
	    break;
    }
    var src_str = GetLeftsideStr();
    var src_blen = ByteLen(src_str);

    var dst_len = dst_str.length;
    var dst_blen = ByteLen(dst_str);

    if (dst_blen < src_blen) {
	return ret;
    }
    return ByteMid(dst_str, src_blen, 1);
}

function GetLeft() {
    var ret = "";
    var now_view_x = document.selection.GetActivePointX(mePosView);
    if (now_view_x < 2) {
        return ret;
    }
    var now_view_y = document.selection.GetActivePointY(mePosView);
    var line_str = GetLineStr(now_view_y);

    return line_str.charAt(now_view_x - 2);
}

function GetRight() {
    var ret = "";
    var now_view_x = document.selection.GetActivePointX(mePosView);
    var now_view_y = document.selection.GetActivePointY(mePosView);
    var line_str = GetLineStr(now_view_y);

    if (now_view_x  >= line_str.length) {
        return ret;
    }
    return line_str.charAt(now_view_x)
}
//
//' いずれかにマッチしていれば 1, 非マッチなら 0 を返す
//Function IsStrMatch(s, arr)
//    IsStrMatch = 0
//    
//    If Not IsArray(arr) Then Exit Function
//    
//    Dim ar
//    For Each ar In arr
//        If s = ar Then
//            IsStrMatch = 1
//            Exit Function
//        End If
//    Next
//End Function
//
//Sub InsertText(ByVal c)
//    If c = "" Then Exit Sub
//    
//    Dim ismulti
//    ismulti = False
//    
//    Dim isrep
//    If IsStrMatch(GetCur, Array(" ", "─", "│", "┼", "┌", "┐", "┘", "└", "//├", "┬", "┤", "┴", "━", "┃", "╋", "┏", "┓", "┛", "┗", "┣", "┳", "//┫", "┻")) = 1 Then
//        isrep = True
//    Else
//        isrep = False
//    End If
//    
//    If isrep Then
//        BeginSelect
//        MoveRight
//    End If
//    Call InsText(CStr(c))
//    MoveLeft
//End Sub
//
//Function MoveTop()
//    MoveTop = False
//    
//    Dim x, y
//    x = CLng(ExpandParameter("$x"))
//    y = CLng(ExpandParameter("$y"))
//    
//    If y = 1 Then Exit Function
//    
//    Dim strToCur
//    strToCur = Mid(GetLineStr(CLng(y)), 1, x)
//    Dim byteLenCur
//    byteLenCur = ByteLen(strToCur)
//    Dim charByte
//    charByte = 2
//
//    Dim sp, s
//    sp = 0
//    s = GetLineStr(CLng(y - 1))
//    If ByteLen(s) < byteLenCur Then sp = byteLenCur - ByteLen(s) - charByte
//    Editor.Up
//    MoveTop = True
//    
//    If sp = 0 Then Exit Function
//    
//    Dim i, spcs
//    spcs = ""
//    For i = 1 To sp
//        spcs = spcs & " "
//    Next
//    Call InsText(CStr(spcs))
//End Function
//
//Function MoveBottom()
//    MoveBottom = True
//    
//    Dim x, y
//    x = CLng(ExpandParameter("$x"))
//    y = CLng(ExpandParameter("$y"))
//
//    Dim strToCur
//    strToCur = Mid(GetLineStr(CLng(y)), 1, x)
//    Dim byteLenCur
//    byteLenCur = ByteLen(strToCur)
//    Dim charByte
//    charByte = 2
//    
//    Dim sp
//    If IsFinalLine(y) Then
//        GoLineEnd
//        InsertCR
//        Dim xNew, yNew
//        xNew = CLng(ExpandParameter("$x"))
//        yNew = CLng(ExpandParameter("$y"))
//        Dim strToCurNew
//        strToCurNew =  Mid(GetLineStr(CLng(yNew)), 1, xNew)
//        sp = byteLenCur - ByteLen(strToCurNew) - charByte
//    Else
//        Dim s
//        s = GetLineStr(CLng(y + 1))
//        If ByteLen(s) < byteLenCur Then sp = byteLenCur - ByteLen(s) - charByte
//        Editor.Down
//    End If
//    
//    If sp = 0 Then Exit Function
//    
//    Dim i, spcs
//    spcs = ""
//    For i = 1 To sp
//        spcs = spcs & " "
//    Next
//    Call InsText(CStr(spcs))
//End Function
//
//Function MoveLeft()
//    MoveLeft = False
//    
//    If CLng(ExpandParameter("$x")) = 1 Then Exit Function
//    Editor.Left
//    
//    If GetCur = " " Then
//        If CLng(ExpandParameter("$x")) > 1 Then
//            Editor.Left
//            If GetCur <> " " Then Editor.Right
//        End If
//    End If
//    
//    MoveLeft = True
//End Function
//
//Function MoveRight()
//    MoveRight = True
//    
//    Dim cur
//    cur = GetCur
//    If cur = "" Then Exit Function
//    Editor.Right
//    
//    If cur = " " And GetCur = " " Then Editor.Right
//End Function
//
//Function ByteLen(ByVal s)
//    ByteLen = 0
//    Dim i
//    For i = 1 to Len(s)
//        Dim c
//        c = Mid(s, i, 1)
//        If c = vbCr Or c = vbLf Then Exit For
//        ByteLen = ByteLen + ByteSize(c)
//    Next
//End Function
//
//Function ByteSize(ByVal c)
//    ByteSize = 0
//    If Len(c) = 0 Then Exit Function
//    
//    '半角文字は1バイトとして扱う
//    If (Asc(c) >= 1) And (Asc(c) <= 255) Then
//        ByteSize = 1
//    Else
//        ByteSize = 2
//        End If
//End Function
//
//' 文字列sの indexバイト目から length文字取得
//Function ByteMid(ByVal s, ByVal index, ByVal length)
//    ByteMid = ""
//    
//    Dim i, bidx
//    bidx = 0
//    For i = 1 To Len(s)
//        Dim c
//        c    = Mid(s, i, 1)
//        bidx = bidx + ByteSize(c)
//        If bidx >= index Then
//            If length > 0 Then ByteMid = ByteMid & c
//            length = length - 1
//            If length = 0 Then Exit For
//        End If
//    Next
//End Function
//
//Function IsFinalLine(lineno)
//    IsFinalLine = False
//    If lineno = GetLineCount(CLng(0)) Then IsFinalLine = True
//End Function
//
//Function InsertCR()
//    Call Char(CLng(13))
//End Function
//
/****************************************************************
* カーソル位置から左側の文字列取得
*
* 引数 ： now_view_x カーソルのx位置
* 戻り値： 文字列
*
****************************************************************/
function GetLeftsideStr(now_view_x) {
    document.selection.CharLeft(true, (now_view_x - 1));
    var ret = document.selection.Text;
    document.selection.CharRight(false, (now_view_x - 1));
    return ret;
}

/****************************************************************
* 半角文字判定
*
* 引数 ： char チェックする文字
* 戻り値： true:半角、false:半角でない
*
****************************************************************/
function IsHankaku(_char,flg) {
    //var c = _char.charCodeAt(0);
    var c = _char;
    // Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
    // Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
    if ( (c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
        return true;
    } else {
        return false;
    }
}

/****************************************************************
* 指定行の文字列取得
*
* 引数 ： なし
* 戻り値： 文字列
*
****************************************************************/
function GetLineStr(line_no) {
    var now_view_x = document.selection.GetActivePointX(mePosView);
    var now_view_y = document.selection.GetActivePointY(mePosView);
    document.selection.SetActivePoint(mePosView, now_view_x, line_no);
    document.selection.EndOfLine();
    var end_view_x = document.selection.GetActivePointX(mePosView);
    document.selection.CharLeft(true, (end_view_x - 1));
    var ret = document.selection.Text;
    document.selection.CharRight(false, (now_view_x - 1));
    document.selection.SetActivePoint(mePosView, now_view_x, now_view_y);
    return ret;
}
