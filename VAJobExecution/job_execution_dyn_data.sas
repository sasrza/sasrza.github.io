* Declare input parameter;
%global INJSON;

*==================================================================;
* Initialization;
*==================================================================;
* The source table to be queried is loaded in memory in the Public caslib;
options cashost="sasdnc-19w47-vdmml-2.visualanalytics.sashq-r.openstack.sas.com" casport=5570;
cas mySession;

libname PUBLIC CAS caslib="Public";

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
proc print data=indata.root(drop=ordinal_root);
run; 

*==================================================================;
* Finalization;
*==================================================================;
cas mySession terminate;
