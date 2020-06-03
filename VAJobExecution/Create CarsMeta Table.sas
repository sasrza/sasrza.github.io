proc sql;
  create table CarsMeta as
  select name,
         case
            when label=' ' then name
            else label end as Label
    from sashelp.vcolumn
  where libname='SASHELP' and memname='CARS';
quit;

options cashost="your.host.name" casport=5570;
cas mySession;

  proc casutil outcaslib="Public"; 
    DROPTABLE casdata="CarsMeta" incaslib="Public" QUIET;
    LOAD data=CarsMeta outcaslib="Public" promote;
  quit;
  
cas mySession terminate;