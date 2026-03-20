Imports System.Data
Imports System.IO
Imports System.Net.Http.Headers
Imports System.Reflection.Metadata.BlobBuilder
Imports System.Security.Cryptography
Imports System.Text
Imports System.Threading
Imports Microsoft.AspNetCore.Authorization
Imports Microsoft.AspNetCore.Hosting
Imports Microsoft.AspNetCore.Http
Imports Microsoft.AspNetCore.Mvc
Imports Microsoft.AspNetCore.StaticFiles
Imports Microsoft.Extensions.FileProviders
Imports Microsoft.Extensions.Logging
Imports Newtonsoft.Json.Linq
Imports Org.BouncyCastle.Asn1
Imports UtilityLibraries

Namespace absapi.RGI

    <Route("api/VAN/[controller]")>
    Public Class ECController
        Inherits ABSController

        Private _logger As ILogger(Of ICController)

        Public Sub New(JWTsettings As IJWTSettings, ABSSettings As IABSSettings, hostingEnvironment As IWebHostEnvironment, httpContextAccessor As IHttpContextAccessor, logger As ILogger(Of ICController))
            MyBase.New(JWTsettings, ABSSettings, hostingEnvironment, httpContextAccessor)
            _logger = logger
        End Sub

        <HttpGet>
        <Route("ServerStatus")>
        Public Function ServerStatus() As IActionResult

            Using TryCast(ASCDATA1, IDisposable)

                Try
                    Return Ok(ASCDATA1._oracon.ConnectionString.ToString & vbCrLf & DateTime.Now)

                Catch ex As Exception
                    ERRORS.Add(ex.Message)
                    API_Result = New With {.SUCCESS = False, .ERRORS = ERRORS}
                    Return StatusCode(500, API_Result)
                End Try
            End Using

        End Function

        <HttpGet>
        <Route("GetRetailCalendar/{yyyy}")>
        Public Function GetRetailCalendar(yyyy As String) As IActionResult

            Using TryCast(ASCDATA1, IDisposable)

                Try
                    Dim requestedYear As Integer = ValidateRetailCalendarYear(yyyy)

                    CreateRetailCalendarTable()
                    LoadRetailCalendarData(requestedYear)

                    Dim astwcal1 As List(Of Object) = ASCDATA1.DataTable2Objects(dst.Tables("ASTWCAL1"), "")
                    Dim gltparm3 As List(Of Object) = ASCDATA1.DataTable2Objects(dst.Tables("GLTPARM3"), "")
                    Dim years As New List(Of Integer)

                    For offset As Integer = 0 To 4
                        years.Add(requestedYear + offset)
                    Next

                    Return Ok(New With {
                        .requestedYear = requestedYear,
                        .years = years,
                        .astwcal1 = astwcal1,
                        .gltparm3 = gltparm3
                    })
                Catch ex As Exception
                    ERRORS.Add(ex.Message)
                    API_Result = New With {.SUCCESS = False, .ERRORS = ERRORS}
                    Return StatusCode(500, API_Result)
                End Try
            End Using

        End Function

        <Route("test1/{id}/{id2}")>
        Public Function Dana1(id2 As String, id As String) As String
            'http://localhost:5000/api/test1/a/b
            ' returns 
            'this is a get test - ab
            Return "this is a get test - " & id & " " & id2
        End Function


        <HttpGet>
        <Route("Get_eComm_Summary")>
        Public Function Get_eComm_Summary() As IActionResult

            Using TryCast(ASCDATA1, IDisposable)

                Try

                    Get_Data()

                    Dim OPENs As List(Of Object) = ASCDATA1.DataTable2Objects(dst.Tables("ARTCUSTX_OPEN"), "")
                    Dim BOOKs As List(Of Object) = ASCDATA1.DataTable2Objects(dst.Tables("ARTCUSTX_BOOK"), "")
                    Dim SHIPs As List(Of Object) = ASCDATA1.DataTable2Objects(dst.Tables("ARTCUSTX_SHIP"), "")
                    Dim RTRNs As List(Of Object) = ASCDATA1.DataTable2Objects(dst.Tables("ARTCUSTX_RTRN"), "")

                    Dim GLTPARM2s As List(Of Object) = ASCDATA1.DataTable2Objects(dst.Tables("GLTPARM2"), "")

                    'Return New With {BOOKs, SHIPs, RTRNs}

                    'Return Ok(New With {.BOOK = BOOKs, .SHIP = SHIPs, .RTRN = RTRNs})
                    Return Ok(New With {OPENs, BOOKs, SHIPs, RTRNs, GLTPARM2s})
                Catch ex As Exception
                    ERRORS.Add(ex.Message)
                    API_Result = New With {.SUCCESS = False, .ERRORS = ERRORS}
                    Return StatusCode(500, API_Result)
                End Try
            End Using

        End Function

        Sub Create_DataTables()

            For Each TYPE As String In New String() {"OPEN", "BOOK", "SHIP", "RTRN", "PYMT"}
                'Dim rowARTCUSTX_DASH As DataRow = dst.Tables("ARTCUSTX_DASH").NewRow
                'rowARTCUSTX_DASH.Item("TYPE") = TYPE
                'dst.Tables("ARTCUSTX_DASH").Rows.Add(rowARTCUSTX_DASH)

                With dst.Tables.Add($"ARTCUSTX_{TYPE}")
                    .Columns.Add("TYPE")
                    .Columns.Add("YP")
                    .Columns.Add("CNT", GetType(System.Int32))

                    If TYPE = "PYMT" Then
                        .Columns.Add("PYMT", GetType(System.Decimal))
                        .Columns.Add("APPL", GetType(System.Decimal))
                        .Columns.Add("FEE", GetType(System.Decimal))
                        .Columns.Add("OTHER", GetType(System.Decimal))
                        .Columns.Add("GL", GetType(System.Decimal))
                        .Columns.Add("CBOA", GetType(System.Decimal))
                        .Columns.Add("TB", GetType(System.Decimal))
                    Else

                        .Columns.Add("QTY", GetType(System.Int32))
                        .Columns.Add("AMT", GetType(System.Decimal))
                        If TYPE = "OPEN" Then
                            .Columns.Add("MIN_DATE", GetType(System.DateTime))
                            .Columns.Add("MAX_DATE", GetType(System.DateTime))
                        ElseIf TYPE = "BOOK" Then
                            .Columns.Add("CNT_OPEN", GetType(System.Int32))
                            .Columns.Add("CNT_PICK", GetType(System.Int32))
                            .Columns.Add("CNT_SHIP", GetType(System.Int32))
                            .Columns.Add("CNT_CANC", GetType(System.Int32))
                        ElseIf TYPE = "SHIP" Then
                            .Columns.Add("GRS", GetType(System.Decimal))
                            .Columns.Add("DSC", GetType(System.Decimal))
                            .Columns.Add("UNPAID", GetType(System.Int32))
                        ElseIf TYPE = "RTRN" Then
                            .Columns.Add("GRS", GetType(System.Decimal))
                            .Columns.Add("DSC", GetType(System.Decimal))
                            .Columns.Add("UNPAID", GetType(System.Int32))
                        End If
                    End If
                    .PrimaryKey = New DataColumn() { .Columns("TYPE"), .Columns("YP")}
                End With
            Next

        End Sub

        Sub Get_Data()

            Dim CYP As String = ASCDATA1.Get_Current_YP()
            Dim CUST_CODE As String = "SKINCOM"

            Create_DataTables()

            Dim sqlGLTPARM2 As String = $"Select * from GLTPARM2 where OPS_YYYYPP  between {ASCDATA1.Period_Calc(CYP, -2)} and {CYP}"
            ASCDATA1.Create_TDA(dst.Tables.Add, "GLTPARM2", sqlGLTPARM2, 0, False, "", 1)
            ASCDATA1.Fill_Records("GLTPARM2")

            Dim ARTCUSTX As String = ""
            Create_ARTCUSTX(True, ARTCUSTX, CYP)
            Create_ARTCUSTX(False, ARTCUSTX, CYP)

            Dim sqlARTCUSTX As String = "Select * from " & ARTCUSTX
            ASCDATA1.Create_TDA(dst.Tables.Add, "ARTCUSTX", sqlARTCUSTX, 0, False, "", 1)

            For Each TYPE As String In New String() {"OPEN", "BOOK", "SHIP", "RTRN", "PYMT"}
                dst.Tables($"ARTCUSTX_{TYPE}").Rows.Clear()
            Next
            'dst.Tables("ARTPYMTS").Rows.Clear()

            Dim LAST_YP As String = ""

            For YPs As Integer = 0 To 2

                Dim YP As String = CYP
                If YPs > 0 Then
                    YP = ASCDATA1.Period_Calc(CYP, -1 * YPs)
                End If

                If YPs > 0 Then
                    Dim sql As String = $"
Begin Declare Cursor C1 is 
 Select * from {ARTCUSTX} where CUST_CODE = '{CUST_CODE}' for Update;
 Begin For R1 in C1 Loop  
  {sqlSOTORDR1_BOOK_SHIP_RTRN(YP, CYP, ARTCUSTX)}
 End Loop; End;
End;"
                    ASCDATA1.ExecuteSQL(sql)

                    'ASCDATA1.Fill_Records("ARTCUSTX")
                End If

                ASCDATA1.Fill_Records("ARTCUSTX")

                Dim rowARTCUSTX As DataRow = dst.Tables("ARTCUSTX").Rows.Find(CUST_CODE)

                ' 'Dim rowARTPYMTS As DataRow = Fill_Record("ARTPYMTS", New String() {YP, CUST_CODE})
                ' ASCMAIN1.sql = Replace(Replace(sqlARTPYMTS, ":PARM1", YP), ":PARM2", CUST_CODE)
                ' Fill_Records("ARTPYMTS",,, ASCMAIN1.sql)
                ' Dim rowARTPYMTS As DataRow = dst.Tables("ARTPYMTS").Rows(0)

                For Each TYPE As String In New String() {"OPEN", "BOOK", "SHIP", "RTRN"} ', "PYMT"}

                    If TYPE = "OPEN" And YPs > 0 Then
                        ' DO NOTHING FOR OPEN WHEN PULLING IN HISTORY
                    Else

                        Dim rowARTCUSTX_TYPE As DataRow = dst.Tables($"ARTCUSTX_{TYPE}").NewRow
                        With rowARTCUSTX_TYPE
                            .Item("TYPE") = TYPE
                            .Item("YP") = YP

                            If TYPE = "PYMT" Then
                                '.Item("CNT") = rowARTPYMTS.Item("RECS")
                                '.Item("PYMT") = rowARTPYMTS.Item("PYMT")
                                '.Item("APPL") = rowARTPYMTS.Item("APPL")
                                '.Item("FEE") = rowARTPYMTS.Item("FEE")
                                '.Item("OTHER") = rowARTPYMTS.Item("OTHER")
                                '.Item("CBOA") = rowARTPYMTS.Item("CBOA")
                                '.Item("TB") = rowARTPYMTS.Item("TB")
                            Else
                                .Item("CNT") = rowARTCUSTX.Item($"{TYPE}_CNT")
                                .Item("QTY") = rowARTCUSTX.Item($"{TYPE}_QTY")
                                .Item("AMT") = rowARTCUSTX.Item($"{TYPE}_AMT")
                            End If

                            If TYPE = "OPEN" Then
                                .Item("YP") = "000000"
                                .Item("MIN_DATE") = rowARTCUSTX.Item($"{TYPE}_MIN_DATE")
                                .Item("MAX_DATE") = rowARTCUSTX.Item($"{TYPE}_MAX_DATE")
                            ElseIf TYPE = "BOOK" Then
                                .Item("CNT_OPEN") = rowARTCUSTX.Item($"{TYPE}_CNT_OPEN")
                                .Item("CNT_PICK") = rowARTCUSTX.Item($"{TYPE}_CNT_PICK")
                                .Item("CNT_SHIP") = rowARTCUSTX.Item($"{TYPE}_CNT_SHIP")
                                .Item("CNT_CANC") = rowARTCUSTX.Item($"{TYPE}_CNT_CANC")
                            ElseIf TYPE = "SHIP" Then
                                .Item("GRS") = rowARTCUSTX.Item($"{TYPE}_GRS")
                                .Item("DSC") = rowARTCUSTX.Item($"{TYPE}_DSC")
                                .Item("UNPAID") = rowARTCUSTX.Item($"AR_OPEN_CNT")
                            ElseIf TYPE = "RTRN" Then
                                .Item("GRS") = rowARTCUSTX.Item($"{TYPE}_GRS")
                                .Item("DSC") = rowARTCUSTX.Item($"{TYPE}_DSC")
                                .Item("UNPAID") = rowARTCUSTX.Item($"AR_OPEN_CNT_C")
                            End If
                        End With
                        dst.Tables($"ARTCUSTX_{TYPE}").Rows.Add(rowARTCUSTX_TYPE)
                    End If
                Next

                LAST_YP = YP
            Next
        End Sub

        Function sqlSOTORDR1_BOOK_SHIP_RTRN(YP As String, CYP As String, ARTCUSTX As String) As String

            Dim sql As String = $"
  Begin Declare Cursor C2 is 
   Select Count(Distinct SOTORDR1.ORDR_NO) BOOK_CNT, Sum (SOTORDR2.ORDR_QTY) BOOK_QTY, Sum (SOTORDR2.ORDR_QTY * SOTORDR2.ORDR_UNIT_PRICE) BOOK_AMT
    , MIN (SOTORDR1.ORDR_DATE) MIN_DATE, MAX (SOTORDR1.ORDR_DATE) MAX_DATE
    , SUM (CASE WHEN SOTORDR1.ORDR_STATUS = 'O' THEN 1 ELSE 0 END) CNT_OPEN
    , SUM (CASE WHEN SOTORDR1.ORDR_STATUS = 'P' THEN 1 ELSE 0 END) CNT_PICK
    , SUM (CASE WHEN SOTORDR1.ORDR_STATUS = 'F' THEN 1 ELSE 0 END) CNT_SHIP
    , SUM (CASE WHEN SOTORDR1.ORDR_STATUS = 'C' THEN 1 ELSE 0 END) CNT_CANC
    from SOTORDR1,SOTORDR2
    where SOTORDR2.ORDR_NO = SOTORDR1.ORDR_NO and SOTORDR1.CUST_CODE = R1.CUST_CODE
      and SOTORDR1.ORDR_YYYYPP_BOOKED = '{YP}';
   Begin For R2 in C2 Loop
    Update {ARTCUSTX} Set BOOK_CNT = R2.BOOK_CNT, BOOK_QTY = R2.BOOK_QTY, BOOK_AMT = R2.BOOK_AMT
    , BOOK_MIN_DATE = R2.MIN_DATE, BOOK_MAX_DATE = R2.MAX_DATE
    , BOOK_CNT_OPEN = R2.CNT_OPEN, BOOK_CNT_PICK = R2.CNT_PICK, BOOK_CNT_SHIP = R2.CNT_SHIP, BOOK_CNT_CANC = R2.CNT_CANC
     where Current of C1;
   End Loop; End;
  End;

  Begin Declare Cursor C2 is 
   Select Count(Distinct SOTINVH1.INV_NO) SHIP_CNT, Sum (SOTINVH2.ORDR_QTY_SHIP) SHIP_QTY, Sum (SOTINVH2.ORDR_QTY_SHIP * SOTINVH2.ORDR_UNIT_PRICE) SHIP_AMT
    , Sum (SOTINVH2.ORDR_QTY_SHIP * SOTORDR2.ORDR_RETAIL_PRICE) SHIP_GRS
    , Sum (SOTINVH2.ORDR_QTY_SHIP * (SOTORDR2.ORDR_RETAIL_PRICE - SOTORDR2.ORDR_UNIT_PRICE)) SHIP_DSC
    from SOTINVH1,SOTINVH2,SOTORDR2,SOTPICK2
    where SOTINVH1.CUST_CODE = R1.CUST_CODE
AND SOTPICK2.PICK_NO = SOTINVH1.PICK_NO AND SOTPICK2.PICK_LNO = SOTINVH2.INV_LNO
      AND SOTORDR2.ORDR_NO = SOTPICK2.ORDR_NO AND SOTORDR2.ORDR_LNO = SOTPICK2.ORDR_LNO
      and SOTINVH2.INV_TYPE = SOTINVH1.INV_TYPE and SOTINVH2.INV_NO = SOTINVH1.INV_NO
      and SOTINVH1.INV_TYPE = 'I' and SOTINVH1.ORDR_YYYYPP_UPDATED = '{YP}';
   Begin For R2 in C2 Loop
    Update {ARTCUSTX} Set SHIP_CNT = R2.SHIP_CNT, SHIP_QTY = R2.SHIP_QTY, SHIP_AMT = R2.SHIP_AMT
    , SHIP_GRS = R2.SHIP_GRS, SHIP_DSC = R2.SHIP_DSC
     where Current of C1;
   End Loop; End;
  End;

  Begin Declare Cursor C2 is 
   Select Count(Distinct X.INV_NO) RTRN_CNT, Sum (X.ORDR_QTY_SHIP) RTRN_QTY, Sum (X.ORDR_QTY_SHIP * X.ORDR_UNIT_PRICE) RTRN_AMT
   , Sum (X.ORDR_QTY_SHIP * DECODE(X.ORDR_NO,NULL,SOTORDR2.ORDR_UNIT_PRICE,SOTORDR2.ORDR_RETAIL_PRICE)) RTRN_GRS
   , Sum (X.ORDR_QTY_SHIP * DECODE(X.ORDR_NO,NULL,SOTORDR2.ORDR_UNIT_PRICE,(SOTORDR2.ORDR_RETAIL_PRICE - SOTORDR2.ORDR_UNIT_PRICE))) RTRN_DSC
   from (
    Select SOTINVH1.INV_NO, SOTRTNL1.ORDR_NO, SOTINVH2.INV_LNO ORDR_LNO, SOTINVH2.ORDR_QTY_SHIP, SOTINVH2.ORDR_UNIT_PRICE
        from SOTINVH1,SOTINVH2,SOTRTNL1
        where SOTINVH1.CUST_CODE =  R1.CUST_CODE
          and SOTINVH2.INV_TYPE = SOTINVH1.INV_TYPE and SOTINVH2.INV_NO = SOTINVH1.INV_NO
          and SOTINVH1.INV_TYPE = 'C' and SOTINVH1.ORDR_YYYYPP_UPDATED = '{YP}'
          AND SOTRTNL1.INV_NO (+) = SOTINVH1.INV_NO
    ) X,SOTORDR2
   where SOTORDR2.ORDR_NO (+) = X.ORDR_NO
     and SOTORDR2.ORDR_LNO (+) = X.ORDR_LNO;
   Begin For R2 in C2 Loop
    Update {ARTCUSTX} Set RTRN_CNT = R2.RTRN_CNT, RTRN_QTY = R2.RTRN_QTY, RTRN_AMT = R2.RTRN_AMT
    , RTRN_GRS = R2.RTRN_GRS, RTRN_DSC = R2.RTRN_DSC
     where Current of C1;
   End Loop; End;
  End;
"

            If YP = CYP Then
                sql &= $"
  Begin Declare Cursor C2 is 
   Select Count(Distinct ARTOPEN1.INV_NUM) AR_OPEN_CNT, Sum (ARTOPEN1.INV_BALANCE) AR_OPEN_AMT
    , Sum (Case when ARTOPEN1.INV_DATE > TRUNC(SYSDATE-3) then 1 else 0 end) AR_OVER_CNT
    , Sum (Case when ARTOPEN1.INV_DATE > TRUNC(SYSDATE-3) then ARTOPEN1.INV_BALANCE else 0 end) AR_OVER_AMT
    from ARTOPEN1
    where ARTOPEN1.CUST_CODE = R1.CUST_CODE and ARTOPEN1.OPS_YYYYPP <= '{CYP}' and ARTOPEN1.INV_TYPE = 'I';
   Begin For R2 in C2 Loop
    Update {ARTCUSTX} Set AR_OPEN_CNT = R2.AR_OPEN_CNT, AR_OPEN_AMT = R2.AR_OPEN_AMT, AR_OVER_CNT = R2.AR_OVER_CNT, AR_OVER_AMT = R2.AR_OVER_AMT
     where Current of C1;
   End Loop; End;
  End;
  Begin Declare Cursor C2 is 
   Select Count(Distinct ARTOPEN1.INV_NUM) AR_OPEN_CNT, Sum (ARTOPEN1.INV_BALANCE) AR_OPEN_AMT
    from ARTOPEN1
    where ARTOPEN1.CUST_CODE = R1.CUST_CODE and ARTOPEN1.OPS_YYYYPP <= '{CYP}' and ARTOPEN1.INV_TYPE <> 'I';
   Begin For R2 in C2 Loop
    Update {ARTCUSTX} Set AR_OPEN_CNT_C = R2.AR_OPEN_CNT, AR_OPEN_AMT_C = R2.AR_OPEN_AMT
     where Current of C1;
   End Loop; End;
  End;
"
            Else
                sql &= $"
  Begin Declare Cursor C2 is 
   Select Count(Distinct ARTOPEN1.INV_NUM) AR_OPEN_CNT, Sum (ARTOPEN1.INV_BALANCE) AR_OPEN_AMT
    from (Select DETL_CVX_NO CUST_CODE, DETL_CVX_TYPE INV_TYPE, DETL_CTL_NO INV_NUM, CREC_AMT INV_BALANCE
           from GLTCREC3 where OPS_YYYYPP = '{YP}' and DETL_CTL_TYPE = 'I' and CREC_TYPE_CODE = 'AR') ARTOPEN1
    where ARTOPEN1.CUST_CODE = R1.CUST_CODE;
   Begin For R2 in C2 Loop
    Update {ARTCUSTX} Set AR_OPEN_CNT = R2.AR_OPEN_CNT, AR_OPEN_AMT = R2.AR_OPEN_AMT, AR_OVER_CNT = 0, AR_OVER_AMT = 0
     where Current of C1;
   End Loop; End;
  End;

  Begin Declare Cursor C2 is 
   Select Count(Distinct ARTOPEN1.INV_NUM) AR_OPEN_CNT, Sum (ARTOPEN1.INV_BALANCE) AR_OPEN_AMT
    from (Select DETL_CVX_NO CUST_CODE, DETL_CVX_TYPE INV_TYPE, DETL_CTL_NO INV_NUM, CREC_AMT INV_BALANCE
           from GLTCREC3 where OPS_YYYYPP = '{YP}' and DETL_CTL_TYPE <> 'I' and CREC_TYPE_CODE = 'AR') ARTOPEN1
    where ARTOPEN1.CUST_CODE = R1.CUST_CODE;
   Begin For R2 in C2 Loop
    Update {ARTCUSTX} Set AR_OPEN_CNT_C = R2.AR_OPEN_CNT, AR_OPEN_AMT_C = R2.AR_OPEN_AMT
     where Current of C1;
   End Loop; End;
  End;
"
            End If

            Return sql
        End Function

        Sub Create_ARTCUSTX(initialize As Boolean, ByRef ARTCUSTX As String, CYP As String)

            Dim sql As String = "Select ARTCUST1.CUST_CODE, ARTCUST1.CUST_NAME from ARTCUST1 where ARTCUST1.POST_CODE = 'B2C'"

            If initialize Or ARTCUSTX = "" Then
                ARTCUSTX = Temp_Table(sql)
                For Each COL As String In New String() {"OPEN", "BOOK", "SHIP", "RTRN"}
                    ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add {COL}_CNT NUMBER (6,0)")
                    ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add {COL}_QTY NUMBER (6,0)")
                    ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add {COL}_AMT NUMBER (12,2)")

                    ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add {COL}_MIN_DATE DATE")
                    ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add {COL}_MAX_DATE DATE")

                    ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add {COL}_CNT_OPEN NUMBER (6,0)")
                    ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add {COL}_CNT_PICK NUMBER (6,0)")
                    ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add {COL}_CNT_SHIP NUMBER (6,0)")
                    ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add {COL}_CNT_CANC NUMBER (6,0)")

                    ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add {COL}_GRS NUMBER (12,2)")
                    ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add {COL}_DSC NUMBER (12,2)")
                    ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add {COL}_UNPAID NUMBER (6,0)")

                Next
                ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add AR_OPEN_CNT NUMBER (6,0)")
                ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add AR_OPEN_AMT NUMBER (12,2)")
                ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add AR_OVER_CNT NUMBER (6,0)")
                ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add AR_OVER_AMT NUMBER (12,2)")
                ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add AR_OPEN_CNT_C NUMBER (6,0)")
                ASCDATA1.ExecuteSQL($"Alter Table {ARTCUSTX} Add AR_OPEN_AMT_C NUMBER (12,2)")
            Else
                ASCDATA1.ExecuteSQL("Truncate Table " & ARTCUSTX)
                ASCDATA1.ExecuteSQL("Insert into " & ARTCUSTX & " (CUST_CODE, CUST_NAME) " & sql)

                sql = $"
Begin Declare Cursor C1 is 
 Select * from {ARTCUSTX} for Update;
 Begin For R1 in C1 Loop

  Begin Declare Cursor C2 is 
   Select Count(Distinct SOTORDR1.ORDR_NO) OPEN_CNT, Sum (SOTORDR2.ORDR_QTY_OPEN) OPEN_QTY, Sum (SOTORDR2.ORDR_QTY_OPEN * SOTORDR2.ORDR_UNIT_PRICE) OPEN_AMT
    , MIN (SOTORDR1.ORDR_DATE) MIN_DATE, MAX (SOTORDR1.ORDR_DATE) MAX_DATE
    from SOTORDR1,SOTORDR2
    where SOTORDR2.ORDR_NO = SOTORDR1.ORDR_NO and SOTORDR1.CUST_CODE = R1.CUST_CODE
      and SOTORDR1.ORDR_STATUS = 'O';
   Begin For R2 in C2 Loop
    Update {ARTCUSTX} Set OPEN_CNT = R2.OPEN_CNT, OPEN_QTY = R2.OPEN_QTY, OPEN_AMT = R2.OPEN_AMT
    , OPEN_MIN_DATE = R2.MIN_DATE, OPEN_MAX_DATE = R2.MAX_DATE
     where Current of C1;
   End Loop; End;
  End;
  
  {sqlSOTORDR1_BOOK_SHIP_RTRN(CYP, CYP, ARTCUSTX)}

 End Loop; End;
End;"

                ASCDATA1.ExecuteSQL(sql)

            End If

        End Sub

        Private Function ValidateRetailCalendarYear(yyyy As String) As Integer

            If Len(yyyy) <> 4 OrElse Not IsNumeric(yyyy) Then
                Throw New ApplicationException("Invalid Year (" & yyyy & ")")
            End If

            Dim currentYear As Integer = Val(Mid(ASCDATA1.Get_Current_YP(), 1, 4))
            Dim requestedYear As Integer = Val(yyyy)

            If requestedYear > currentYear + 20 OrElse requestedYear < currentYear - 20 Then
                Throw New ApplicationException("Invalid Year (" & yyyy & ")")
            End If

            Return requestedYear
        End Function

        Private Sub CreateRetailCalendarTable()

            If dst.Tables.Contains("ASTWCAL1") Then
                dst.Tables.Remove("ASTWCAL1")
            End If

            If dst.Tables.Contains("GLTPARM3") Then
                dst.Tables.Remove("GLTPARM3")
            End If

            With dst.Tables.Add("ASTWCAL1")
                .Columns.Add("LINE_NO", GetType(System.Int32))
                .Columns.Add("MONTH")
                .Columns.Add("WEEK_NO")

                For yearSlot As Integer = 1 To 5
                    For daySlot As Integer = 1 To 7
                        .Columns.Add($"DATE_{yearSlot}{daySlot}")
                    Next
                Next
            End With
        End Sub

        Private Sub LoadRetailCalendarData(requestedYear As Integer)

            Dim y1 As String = requestedYear.ToString("0000")
            Dim y5 As String = (requestedYear + 4).ToString("0000")
            Dim sqlGLTPARM3 As String = $"Select * from GLTPARM3 where YYYYWW >= '{y1}01' and YYYYWW <= '{y5}53' Order By YYYYWW"

            ASCDATA1.Create_TDA(dst.Tables.Add, "GLTPARM3", sqlGLTPARM3, 0, False, "", 1)
            ASCDATA1.Fill_Records("GLTPARM3")

            Dim sql As String = "Select SUBSTR(YYYYWW,5,2) WW, SUBSTR(YYYYMM,5,2) MM" _
                & ", REL_WEEK, MAX(MAX_WEEK) MAX_WEEK"

            For Y As Integer = 1 To 5
                sql &= " , MIN(DECODE (SUBSTR(YYYYWW,1,4),'" & Format$(requestedYear + Y - 1, "0000") & "',WEEK_END_DATE,NULL)) Y" & Format$(Y, "0")
            Next Y

            sql &= " From GLTPARM3" _
                & " where YYYYWW >= '" & y1 & "01'" _
                & "   and YYYYWW <= '" & y5 & "53'" _
                & " GROUP BY SUBSTR(YYYYWW,5,2), SUBSTR(YYYYMM,5,2), REL_WEEK" _
                & " ORDER BY SUBSTR(YYYYWW,5,2), SUBSTR(YYYYMM,5,2), REL_WEEK"

            Dim lineNo As Integer = 0

            For Each row As DataRow In ASCDATA1.GetDataTable(sql).Select("", "WW,MM,REL_WEEK")
                Dim relWeek As Integer = Val(row.Item("REL_WEEK") & "")
                Dim maxWeek As Integer = Val(row.Item("MAX_WEEK") & "")
                Dim mm As String = row.Item("MM") & ""
                Dim ww As String = row.Item("WW") & ""
                Dim monthCaption As String = " " & Format(DateSerial(2000, Val(mm), 1), "MMM") & " "
                Dim monthX As String = Mid(monthCaption, relWeek, 1)

                Dim rowASTWCAL1 As DataRow = dst.Tables("ASTWCAL1").NewRow
                lineNo += 1
                rowASTWCAL1.Item("LINE_NO") = lineNo
                rowASTWCAL1.Item("MONTH") = monthX
                rowASTWCAL1.Item("WEEK_NO") = ww

                For Y As Integer = 1 To 5
                    If row.Item("Y" & Format$(Y, "0")) & "" <> "" Then
                        Dim dt As Date = CDate(row.Item("Y" & Format$(Y, "0")))
                        For d As Integer = 1 To 7
                            rowASTWCAL1.Item("DATE_" & Format(Y, "0") & Format(d, "0")) = Format(dt.AddDays(-7 + d), "dd")
                        Next d
                    End If
                Next Y

                dst.Tables("ASTWCAL1").Rows.Add(rowASTWCAL1)

                If relWeek = maxWeek Then
                    rowASTWCAL1 = dst.Tables("ASTWCAL1").NewRow
                    lineNo += 1
                    rowASTWCAL1.Item("LINE_NO") = lineNo
                    dst.Tables("ASTWCAL1").Rows.Add(rowASTWCAL1)
                End If
            Next
        End Sub

    End Class

End Namespace
