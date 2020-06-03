* Declare input parameter;
%global INJSON;

*==================================================================;
* Initialization;
*==================================================================;
* The source table to be queried is loaded in memory in the Public caslib;
options cashost="your.host.name" casport=5570;
cas mySession;

libname public CAS caslib="Public";

* Copy the JSON data from input parameter to a temp file;
filename indata temp;

data _null_;
  file indata;
  length str $32767;
  str = resolve(symget('INJSON'));
  put str;
run;

* Use the JSON engine to provide read-only sequential access to JSON data;
libname indata json;

*==================================================================;
* Main Processing;
*==================================================================; 
* Extract all column name values passed to the job as a JSON table;
proc sql noprint;
  select column_name into :columns separated by ' '
  from indata.root;
quit;

proc print data=public.cars;
  var &columns;
run; 

*==================================================================;
* Finalization;
*==================================================================;
cas mySession terminate;
