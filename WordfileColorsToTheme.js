/* Script Name:   WordfileColorsToTheme.js
   Creation Date: 2013-09-17
   Last Modified: 2013-09-17
   Copyright:     Copyright (c) 2013 by Mofi
   Original:      http://www.ultraedit.com/files/macros/syntaxtools.zip
                  http://www.ultraedit.com/forums/viewtopic.php?t=443

This script scans all opened files for syntax highlighting language name,
color and font style settings, extract them from the files and creates a
new file with all the settings converted to a block which can be inserted
into an UltraEdit theme file as used by UltraEdit v20.00 and later versions.

Recommended usage of this script:

1) Start UltraEdit and close all files.
2) Open all *.uew files from your wordfiles directory as displayed at
   "Advanced - Configuration - Editor Display - Syntax Highlighting.
3) Open this script file.
4) Execute this script by clicking on "Scripting - Run Active Script".
5) Look on automatically opened output window and check for any error.
6) Copy content of the new file into the currently used customized
   UE theme file which is stored in subdirectory "themes" of the INI
   file directory with the name displayed in "Manage Themes" dialog.
   The path to the directory of used INI file can be seen at
   "Advanced - Configuration - Application Layout - Advanced".
7) Save the updated theme file and close this file as well as
   the new file created by the script.
8) Save all modified wordfiles using "File - Save All".
9) Exit UltraEdit and restart UltraEdit.


Disclaimer

THIS SCRIPT IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS
OR IMPLIED, STATUTORY OR OTHERWISE, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE. THE ENTIRE RISK AS TO USE, RESULTS AND PERFORMANCE OF THE SCRIPT IS
ASSUMED BY YOU AND IF THE SCRIPT SHOULD PROVE TO BE DEFECTIVE, YOU ASSUME
THE ENTIRE COST OF ALL NECESSARY SERVICING, REPAIR OR OTHER REMEDIATION.
UNDER NO CIRCUMSTANCES, CAN THE AUTHOR BE HELD RESPONSIBLE FOR ANY DAMAGE
CAUSED IN ANY USUAL, SPECIAL, OR ACCIDENTAL WAY OR BY THE SCRIPT. */

// =========================================================================

// Function GetFileName is from FileNameFunctions.js as published
// at http://www.ultraedit.com/forums/viewtopic.php?f=52&t=6762
function GetFileName (CompleteFileNameOrDocIndexNumber, bWithPoint, bWithPath)
{
   var sNameOfFile = "";
   var sFilePath = "";
   var sFullFileName = "";
   var nLastDirDelim = -1;
   var nOutputType = (typeof(g_nDebugMessage) == "number") ? g_nDebugMessage : 0;

   if (sNameOfFile.length)
   {
      if (typeof(bWithPoint) == "boolean")
      {
         if (bWithPoint) sNameOfFile += '.';
      }
      if (sFilePath.length && (typeof(bWithPath) == "boolean"))
      {
         if (bWithPath) sNameOfFile = sFilePath + sNameOfFile;
      }
   }

   if (typeof(CompleteFileNameOrDocIndexNumber) == "string")
   {
      sFullFileName = CompleteFileNameOrDocIndexNumber;

      if (sFullFileName == "")
      {
         if (nOutputType == 2)
         {
            UltraEdit.messageBox("The input string is an empty string!","GetFileName Error");
         }
         else if (nOutputType == 1)
         {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFileName: The input string is an empty string!");
         }
         return sNameOfFile;
      }

      nLastDirDelim = sFullFileName.lastIndexOf("|");

      if (nLastDirDelim < 0) nLastDirDelim = sFullFileName.lastIndexOf("/");

      if (nLastDirDelim < 0) nLastDirDelim = sFullFileName.lastIndexOf("\\");

      if (nLastDirDelim < 0) sNameOfFile = sFullFileName;
      else
      {
         if (nLastDirDelim == (sFullFileName.length-1))
         {
            if (nOutputType == 2)
            {
               UltraEdit.messageBox("The input string is a path string!","GetFileName Error");
            }
            else if (nOutputType == 1)
            {
               if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
               UltraEdit.outputWindow.write("GetFileName: The input string is a path string!");
            }
            return sNameOfFile;
         }

         nLastDirDelim++;
         sNameOfFile = sFullFileName.substring(nLastDirDelim);
         sFilePath = sFullFileName.substring(0,nLastDirDelim);
      }
   }
   else
   {
      if (UltraEdit.document.length < 1)
      {
         if (nOutputType == 2)
         {
            UltraEdit.messageBox("No document is open currently!","GetFileName Error");
         }
         else if (nOutputType == 1)
         {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFileName: No document is open currently!");
         }
         return sNameOfFile;
      }

      var nDocumentNumber = -1;
      if (typeof(CompleteFileNameOrDocIndexNumber) == "number")
      {
         nDocumentNumber = CompleteFileNameOrDocIndexNumber;
      }

      if (nDocumentNumber >= UltraEdit.document.length)
      {
         if (nOutputType == 2)
         {
            UltraEdit.messageBox("A document with index number "+nDocumentNumber+" does not exist!","GetFileName Error");
         }
         else if (nOutputType == 1)
         {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFileName: A document with index number "+nDocumentNumber+" does not exist!");
         }
         return sNameOfFile;
      }

      if (nDocumentNumber < 0)
      {
         sFullFileName = UltraEdit.activeDocument.path;
         if (UltraEdit.activeDocument.isFTP())
         {
            nLastDirDelim = sFullFileName.lastIndexOf("|");
            if (nLastDirDelim < 0) nLastDirDelim = sFullFileName.lastIndexOf("/");
         }
      }
      else
      {
         sFullFileName = UltraEdit.document[nDocumentNumber].path;
         if (UltraEdit.document[nDocumentNumber].isFTP())
         {
            nLastDirDelim = sFullFileName.lastIndexOf("|");
            if (nLastDirDelim < 0) nLastDirDelim = sFullFileName.lastIndexOf("/");
         }
      }
      if (nLastDirDelim < 0) nLastDirDelim = sFullFileName.lastIndexOf("\\");

      if (nLastDirDelim < 0)
      {
         if (nOutputType == 2)
         {
            UltraEdit.messageBox("File name can't be determined from a new file!","GetFileName Error");
         }
         else if (nOutputType == 1)
         {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFileName: File name can't be determined from a new file!");
         }
         return sNameOfFile;
      }

      nLastDirDelim++;
      sNameOfFile = sFullFileName.substring(nLastDirDelim);
      sFilePath = sFullFileName.substring(0,nLastDirDelim);
   }

   var nLastPointPos = sNameOfFile.lastIndexOf(".");
   if (nLastPointPos <= 0)
   {
      if (nLastPointPos == 0)
      {
         if (nOutputType == 2)
         {
            UltraEdit.messageBox("File \""+sNameOfFile+"\" starts with a point!","GetFileName Warning");
         }
         else if (nOutputType == 1)
         {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFileName: File \""+sNameOfFile+"\" starts with a point!");
         }
      }
      if (typeof(bWithPoint) == "boolean")
      {
         if (bWithPoint) sNameOfFile += '.';
      }
      if (typeof(bWithPath) != "boolean") return sNameOfFile;
      if (!bWithPath) return sNameOfFile;
      return sFilePath + sNameOfFile;
   }
   if (typeof(bWithPoint) == "boolean")
   {
      if (bWithPoint) nLastPointPos++;
   }
   sFullFileName = sNameOfFile.substring(0,nLastPointPos);
   if (typeof(bWithPath) != "boolean") return sFullFileName
   if (!bWithPath) return sFullFileName
   return sFilePath + sFullFileName;
}  // End of function GetFileName

// =========================================================================

// Function GetNameOfFile is from FileNameFunctions.js as published
// at http://www.ultraedit.com/forums/viewtopic.php?f=52&t=6762
function GetNameOfFile (CompleteFileNameOrDocIndexNumber)
{
   var sNameOfFile = "";
   var sFullFileName = "";
   var nLastDirDelim = -1;

   var nOutputType = (typeof(g_nDebugMessage) == "number") ? g_nDebugMessage : 0;

   if (typeof(CompleteFileNameOrDocIndexNumber) == "string")
   {
      sFullFileName = CompleteFileNameOrDocIndexNumber;

      if (sFullFileName == "")
      {
         if (nOutputType == 2)
         {
            UltraEdit.messageBox("The input string is an empty string!","GetNameOfFile Error");
         }
         else if (nOutputType == 1)
         {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetNameOfFile: The input string is an empty string!");
         }
         return sNameOfFile;
      }

      nLastDirDelim = sFullFileName.lastIndexOf("|");

      if (nLastDirDelim < 0) nLastDirDelim = sFullFileName.lastIndexOf("/");

      if (nLastDirDelim < 0) nLastDirDelim = sFullFileName.lastIndexOf("\\");

      if (nLastDirDelim < 0) sNameOfFile = sFullFileName;
      else
      {
         if (nLastDirDelim == (sFullFileName.length-1))
         {
            if (nOutputType == 2)
            {
               UltraEdit.messageBox("The input string is a path string!","GetNameOfFile Error");
            }
            else if (nOutputType == 1)
            {
               if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
               UltraEdit.outputWindow.write("GetNameOfFile: The input string is a path string!");
            }
            return sNameOfFile;
         }

         nLastDirDelim++;
         sNameOfFile = sFullFileName.substring(nLastDirDelim);
      }
   }
   else
   {
      if (UltraEdit.document.length < 1)
      {
         if (nOutputType == 2)
         {
            UltraEdit.messageBox("No document is open currently!","GetNameOfFile Error");
         }
         else if (nOutputType == 1)
         {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetNameOfFile: No document is open currently!");
         }
         return sNameOfFile;
      }

      var nDocumentNumber = -1;
      if (typeof(CompleteFileNameOrDocIndexNumber) == "number")
      {
         nDocumentNumber = CompleteFileNameOrDocIndexNumber;
      }

      if (nDocumentNumber >= UltraEdit.document.length)
      {
         if (nOutputType == 2)
         {
            UltraEdit.messageBox("A document with index number "+nDocumentNumber+" does not exist!","GetNameOfFile Error");
         }
         else if (nOutputType == 1)
         {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetNameOfFile: A document with index number "+nDocumentNumber+" does not exist!");
         }
         return sNameOfFile;
      }

      if (nDocumentNumber < 0)
      {
         sFullFileName = UltraEdit.activeDocument.path;
         if (UltraEdit.activeDocument.isFTP())
         {
            nLastDirDelim = sFullFileName.lastIndexOf("|");
            if (nLastDirDelim < 0) nLastDirDelim = sFullFileName.lastIndexOf("/");
         }
      }
      else
      {
         sFullFileName = UltraEdit.document[nDocumentNumber].path;
         if (UltraEdit.document[nDocumentNumber].isFTP())
         {
            nLastDirDelim = sFullFileName.lastIndexOf("|");
            if (nLastDirDelim < 0) nLastDirDelim = sFullFileName.lastIndexOf("/");
         }
      }
      if (nLastDirDelim < 0) nLastDirDelim = sFullFileName.lastIndexOf("\\");

      if (nLastDirDelim < 0)
      {
         if (nOutputType == 2)
         {
            UltraEdit.messageBox("File name can't be determined from a new file!","GetNameOfFile Error");
         }
         else if (nOutputType == 1)
         {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetNameOfFile: File name can't be determined from a new file!");
         }
         return sNameOfFile;
      }

      nLastDirDelim++;
      sNameOfFile = sFullFileName.substring(nLastDirDelim);
   }

   return sNameOfFile;
}  // End of function GetNameOfFile

// =========================================================================

// Here is the beginning of the main script.

if (UltraEdit.document.length > 0)  // Is any file currently opened?
{
   UltraEdit.insertMode();          // Define environment for the script.
   UltraEdit.columnModeOff();
   UltraEdit.ueReOn();              // Use UltraEdit regular expression engine.
   UltraEdit.selectClipboard(9);    // Use user clipboard 9 for data collection.
   UltraEdit.clearClipboard();

   // The wordfiles must be DOS files which have \r\n as line termination.

   // Make the output window visible used for displaying process information.
   if (UltraEdit.outputWindow.visible == false)
   {
      UltraEdit.outputWindow.showWindow(true);
   }
   UltraEdit.outputWindow.showStatus=false;
   UltraEdit.outputWindow.clear();

   var nLanguages = 0;  // Counts the number of languages processed by the script.

   // The commands in the loop below are executed on all opened files,
   // but only wordfiles are modified by extracting the necessary data.
   for (var nDocIndex = 0; nDocIndex < UltraEdit.document.length; nDocIndex++)
   {
      UltraEdit.document[nDocIndex].top();
      UltraEdit.document[nDocIndex].findReplace.mode=0;
      UltraEdit.document[nDocIndex].findReplace.matchCase=true;
      UltraEdit.document[nDocIndex].findReplace.matchWord=false;
      UltraEdit.document[nDocIndex].findReplace.regExp=true;
      UltraEdit.document[nDocIndex].findReplace.searchDown=true;
      UltraEdit.document[nDocIndex].findReplace.searchInColumn=false;

      // Write a blank line into the output file before processing a file.
      UltraEdit.outputWindow.write("");

      // Get the file name with file extension, but without path.
      var sNameOfFile = GetNameOfFile(nDocIndex);

      // Find line starting with /L and an integer number. If such a line is
      // not found in entire file, ignore this file as it is not a wordfile.
      if (!UltraEdit.document[nDocIndex].findReplace.find("%/L[0-9]+?++$"))
      {
         // Has the file no name, i. e. is a new, unsaved file?
         if (!sNameOfFile.length)
         {
            sNameOfFile = (nDocIndex+1).toString() + " without file name";
         }
         else
         {
            sNameOfFile = "'" + sNameOfFile + "'";
         }
         UltraEdit.outputWindow.write("File "+sNameOfFile+" skipped because no line with a language number found.");
         continue;   // on next file
      }

      // Load this line usually at top of the file into a string variable.
      var sLanguageLine = UltraEdit.document[nDocIndex].selection;

      // Extract from this line the name of the language which should
      // be present in double quotes after the language number.
      var sLanguageName = sLanguageLine.replace(/^\/L\d+\"([^\"]+?)\".*$/,"$1");

      // If the regular expression fails as there is no language name
      // in double quotes, use the name of the wordfile without the file
      // extension as language name and write this name also into the file.
      if (sLanguageName == sLanguageLine)
      {
         // Get file name without file extension.
         sLanguageName = GetFileName(sNameOfFile);

         // If the file has no name, ignore this file although a line
         // starting with /L and a number was found in this file.
         if (!sLanguageName.length)
         {
            UltraEdit.outputWindow.write("File "+((nDocIndex+1).toString())+" without file name skipped because no language name found.");
            continue;   // on next file
         }
         // Create language definition line now with language name.
         sLanguageLine = sLanguageLine.replace(/^(\/L\d+)\"*(.*)$/,'$1"'+sLanguageName+'"$2');

         // Write this line to the file overwriting the selection.
         UltraEdit.document[nDocIndex].write(sLanguageLine);

         // Inform the user about this special modification of the file.
         UltraEdit.outputWindow.write('Added language name "'+sLanguageName+'" to file "'+sLanguageName+'".');
      }

      // The current file is most likely a wordfile which is processed now further.
      UltraEdit.outputWindow.write('Processing wordfile for syntax highlighting language "'+sLanguageName+'" ...');
      nLanguages++;

      // Append the language XML tag to current content of user clipboard 9.
      UltraEdit.clipboardContent += '    <Language Name="'+sLanguageName+'">\r\n';

      // Find the block with the settings for normal text, comments,
      // alternate comments, strings and numbers usually being at top
      // of a wordfile, cut this block from the file and append it to
      // the user clipboard.
      if (UltraEdit.document[nDocIndex].findReplace.find("%/Colors =[ 0-9]+,[ 0-9]+,[ 0-9]+,[ 0-9]+,[ 0-9]+*^p/Colors Back =[ 0-9]+,[ 0-9]+,[ 0-9]+,[ 0-9]+,[ 0-9]+*^p/Colors Auto Back =[ 01]+,[ 01]+,[ 01]+,[ 01]+,[ 01]+*^p/Font Style =[ 0-3]+,[ 0-3]+,[ 0-3]+,[ 0-3]+,[ 0-3]+*^p"))
      {
         UltraEdit.document[nDocIndex].cutAppend();
         UltraEdit.outputWindow.write("Color and font style settings for the 5 standard color groups found and removed.");
      }
      else
      {
         UltraEdit.outputWindow.write('Color settings for "Text", "Comments", "Alternate Block Comments", "Strings" and "Numbers" not found.');
         UltraEdit.outputWindow.write('Please check file \''+sNameOfFile+'\' for not correct formatted lines starting with "/Colors" and "/Font".');
      }

      // Find all color group definition lines and cut the color and font
      // style settings from those lines which are appended with the color
      // group number to the user clipboard 9.
      var nColorGroups = 0;
      while (UltraEdit.document[nDocIndex].findReplace.find("%/C[1-9][0-9]++* Colors =[ 0-9]+Colors Back =[ 0-9]+Colors Auto Back =[ 01]+Font Style =[ 0-3]+?++$"))
      {
         // Load the found line without line termination into a variable.
         var sColorGroupLine = UltraEdit.document[nDocIndex].selection;
         // Extract /C, the color group number and the color and font style
         // settings from the found line if correct present on this line.
         var sColorGroupSettings = sColorGroupLine.replace(/^(\/C[1-9][0-9]*).*?(Colors =[ 0-9]+Colors Back =[ 0-9]+Colors Auto Back =[ 01]+Font Style =[ 0-3]+).*$/,"$1 $2");
         // Append those data to user clipboard 9.
         UltraEdit.clipboardContent += sColorGroupSettings + "\r\n";
         // Remove from the color group line the color and font style
         // settings and write the modified line back to the wordfile.
         sColorGroupLine = sColorGroupLine.replace(/ +Colors =[ 0-9]+Colors Back =[ 0-9]+Colors Auto Back =[ 01]+Font Style =[ 0-3]+.*$/,"");
         UltraEdit.document[nDocIndex].write(sColorGroupLine);
         nColorGroups++;
      }

      // Inform the user in the output window about the number of modified
      // color group lines and append the closing tag for this language to
      // content in user clipboard 9.
      UltraEdit.outputWindow.write("Settings of "+nColorGroups+" color group"+((nColorGroups!=1)?"s":"")+" found in file '"+sNameOfFile+"' and removed.");
      UltraEdit.clipboardContent += '    </Language>\r\n';
      UltraEdit.document[nDocIndex].top();
   }
   // Was any color and font style setting found in any file?
   if (UltraEdit.clipboardContent.length)
   {
      // Paste the cut lines into a new DOS file.
      UltraEdit.newFile();
      UltraEdit.activeDocument.unixMacToDos();
      UltraEdit.activeDocument.unicodeToASCII();
      UltraEdit.activeDocument.paste();
      UltraEdit.activeDocument.top();
      UltraEdit.activeDocument.trimTrailingSpaces();

      UltraEdit.activeDocument.findReplace.mode=0;
      UltraEdit.activeDocument.findReplace.matchCase=true;
      UltraEdit.activeDocument.findReplace.matchWord=false;
      UltraEdit.activeDocument.findReplace.regExp=true;
      UltraEdit.activeDocument.findReplace.searchDown=true;
      UltraEdit.activeDocument.findReplace.searchInColumn=false;
      UltraEdit.activeDocument.findReplace.preserveCase=false;
      UltraEdit.activeDocument.findReplace.replaceAll=true;
      UltraEdit.activeDocument.findReplace.replaceInAllOpen=false;

      // Convert the lines with color group settings to XML format.
      UltraEdit.activeDocument.findReplace.replace("%/C^([0-9]+^) +Colors = ^([0-9]+^) Colors Back = ^([0-9]+^) Colors Auto Back = ^([01]^) Font Style = ^([0-3]^)",'      <ColorPair Category="Color Group ^1" Foreground="^2" Background="^3" Auto="^4"/>^p      <FontStyle Category="Color Group ^1">^5</FontStyle>');

      // Remove all commas at end of all lines with standard color group settings.
      UltraEdit.activeDocument.findReplace.replace(",$","")

      // Convert the color settings of the 5 standard color groups to XML.
      UltraEdit.activeDocument.findReplace.replace("/Colors = ^([0-9]+^),^([0-9]+^),^([0-9]+^),^([0-9]+^),^([0-9]+^)",'      <ColorPair Category="Text" Foreground="^1"^p      <ColorPair Category="Comments" Foreground="^2"^p      <ColorPair Category="Alternate Block Comments" Foreground="^3"^p      <ColorPair Category="Strings" Foreground="^4"^p      <ColorPair Category="Numbers" Foreground="^5"');

      // Background color and background automatic for color group "Text".
      UltraEdit.activeDocument.findReplace.replace('^(<ColorPair Category="Text"?+^)^(^p?+^p?+^p?+^p?+^p/Colors Back = ^)^([0-9]+^),^(?+^p/Colors Auto Back = ^)^([01]^),','^1 Background="^3" Auto="^5"/>^2^4');
      // Background color and background automatic for color group "Comments".
      UltraEdit.activeDocument.findReplace.replace('^(<ColorPair Category="Comments"?+^)^(^p?+^p?+^p?+^p/Colors Back = ^)^([0-9]+^),^(?+^p/Colors Auto Back = ^)^([01]^),','^1 Background="^3" Auto="^5"/>^2^4');
      // Background color and background automatic for color group "Alternate Block Comments".
      UltraEdit.activeDocument.findReplace.replace('^(<ColorPair Category="Alternate Block Comments"?+^)^(^p?+^p?+^p/Colors Back = ^)^([0-9]+^),^(?+^p/Colors Auto Back = ^)^([01]^),','^1 Background="^3" Auto="^5"/>^2^4');
      // Background color and background automatic for color group "Strings".
      UltraEdit.activeDocument.findReplace.replace('^(<ColorPair Category="Strings"?+^)^(^p?+^p/Colors Back = ^)^([0-9]+^),^(?+^p/Colors Auto Back = ^)^([01]^),','^1 Background="^3" Auto="^5"/>^2^4');
      // Background color and background automatic for color group "Numbers".
      UltraEdit.activeDocument.findReplace.replace('^(<ColorPair Category="Numbers"?+^)^p/Colors Back = ^([0-9]+^)^p/Colors Auto Back = ^([01]^)','^1 Background="^2" Auto="^3"/>');

      // Remove font style for color group "Text" as for normal text there is no font style setting.
      UltraEdit.activeDocument.findReplace.replace('^(/Font Style = ^)[0-3],','^1');
      // Font style for color group "Comments".
      UltraEdit.activeDocument.findReplace.replace('^(<ColorPair Category="Comments"?+^p^)^(?+^p?+^p?+^p/Font Style = ^)^([0-3]^),','^1      <FontStyle Category="Comments">^3</FontStyle>^p^2');
      // Font style for color group "Alternate Block Comments".
      UltraEdit.activeDocument.findReplace.replace('^(<ColorPair Category="Alternate Block Comments"?+^p^)^(?+^p?+^p/Font Style = ^)^([0-3]^),','^1      <FontStyle Category="Alternate Block Comments">^3</FontStyle>^p^2');
      // Font style for color group "Strings".
      UltraEdit.activeDocument.findReplace.replace('^(<ColorPair Category="Strings"?+^p^)^(?+^p/Font Style = ^)^([0-3]^),','^1      <FontStyle Category="Strings">^3</FontStyle>^p^2');
      // Font style for color group "Numbers".
      UltraEdit.activeDocument.findReplace.replace('^(<ColorPair Category="Numbers"?+^p^)/Font Style = ^([0-3]^)','^1      <FontStyle Category="Numbers">^2</FontStyle>');

      // Change the values for background color automatic from 0 / 1 to false/true.
      UltraEdit.activeDocument.findReplace.regExp=false;
      UltraEdit.activeDocument.findReplace.replace('Auto="0"','Auto="false"');
      UltraEdit.activeDocument.findReplace.replace('Auto="1"','Auto="true"');

      // Change the values for font style from 0, 1, 2, 3 to Normal, Bold, Italic, Underline.
      UltraEdit.activeDocument.findReplace.replace('0</FontStyle>','Normal</FontStyle>');
      UltraEdit.activeDocument.findReplace.replace('1</FontStyle>','Bold</FontStyle>');
      UltraEdit.activeDocument.findReplace.replace('2</FontStyle>','Italic</FontStyle>');
      UltraEdit.activeDocument.findReplace.replace('3</FontStyle>','Underline</FontStyle>');

      // Replace color black with value 0 by RGB value #000000.
      UltraEdit.activeDocument.findReplace.replace('ground="0"','ground="#000000"');
      // Replace color white with value 16777215 by RGB value #FFFFFF.
      UltraEdit.activeDocument.findReplace.replace('ground="16777215"','ground="#FFFFFF"');

      // Convert all remaining decimal BGR values into hexadecimal RGB values.
      var sLeadingZeros = "000000";
      UltraEdit.activeDocument.findReplace.regExp=true;
      while (UltraEdit.activeDocument.findReplace.find('ground="[0-9]+"'))
      {
         var sDecString = UltraEdit.activeDocument.selection;
         var sNumberLength = sDecString.length - 9;
         var sDecNumber = sDecString.substr(8,sNumberLength);
         var nDecNumber = parseInt(sDecNumber,10);
         var sHexNumber = nDecNumber.toString(16);
         sHexNumber = sHexNumber.toUpperCase();
         var nLeadingZeros = 6 - sHexNumber.length;
         if (nLeadingZeros > 0) sHexNumber = sLeadingZeros.substr(0,nLeadingZeros) + sHexNumber;
         var sHexString = 'ground="#'+sHexNumber.substr(4,2)+sHexNumber.substr(2,2)+sHexNumber.substr(0,2)+'"';
         UltraEdit.activeDocument.write(sHexString);
         // Each decimal value is converted only once using above procedure
         // by simply running a Replace All for all color settings with the
         // same decimal value.
         UltraEdit.activeDocument.findReplace.replace(sDecString,sHexString);
      }
      UltraEdit.activeDocument.top();
   }
   UltraEdit.clearClipboard();
   UltraEdit.selectClipboard(0);
   UltraEdit.outputWindow.write("\nConverted settings of "+nLanguages+" syntax highlighting language"+((nLanguages!=1)?"s":"")+" respectively wordfile"+((nLanguages!=1)?"s":"")+".");
}  // End of main script.
