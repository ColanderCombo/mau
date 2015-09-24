// Do not edit this file; automatically generated by build.py.
"use strict";

Blockly.Lua=new Blockly.Generator("Lua");Blockly.Lua.addReservedWords("___inext,assert,bit,colors,colours,coroutine,disk,dofile,error,fs,fetfenv,getmetatable,gps,help,io,ipairs,keys,loadfile,loadstring,math,native,next,os,paintutils,pairs,parallel,pcall,peripheral,print,printError,rawequal,rawget,rawset,read,rednet,redstone,rs,select,setfenv,setmetatable,sleep,string,table,term,textutils,tonumber,tostring,turtle,type,unpack,vector,write,xpcall,_VERSION,__indext,HTTP,and,break,do,else,elseif,end,false,for,function,if,in,local,nil,not,or,repeat,return,then,true,until,while,add,sub,mul,div,mod,pow,unm,concat,len,eq,lt,le,index,newindex,call,assert,collectgarbage,dofile,error,_G,getmetatable,inpairs,load,loadfile,next,pairs,pcall,print,rawequal,rawget,rawlen,rawset,select,setmetatable,tonumber,tostring,type,_VERSION,xpcall,require,package,string,table,math,bit32,io,file,os,debug");
Blockly.Lua.ORDER_ATOMIC=0;Blockly.Lua.ORDER_HIGH=1;Blockly.Lua.ORDER_EXPONENTIATION=2;Blockly.Lua.ORDER_UNARY=3;Blockly.Lua.ORDER_MULTIPLICATIVE=4;Blockly.Lua.ORDER_ADDITIVE=5;Blockly.Lua.CONCATENATION=6;Blockly.Lua.ORDER_RELATIONAL=7;Blockly.Lua.ORDER_AND=8;Blockly.Lua.ORDER_OR=9;Blockly.Lua.ORDER_NONE=10;Blockly.Lua.INFINITE_LOOP_TRAP=null;Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_="{{{}}}";Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_REGEXP_=RegExp(Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_,"g");
Blockly.Names.PREFIX_="var";Blockly.Lua.init=function(){Blockly.Lua.definitions_={};Blockly.Lua.functionNames_={};Blockly.Variables&&(Blockly.Lua.variableDB_?Blockly.Lua.variableDB_.reset():Blockly.Lua.variableDB_=new Blockly.Names(Blockly.Lua.RESERVED_WORDS_))};Blockly.Lua.SENSOR_REGEXP_=/\Wsensor\./;Blockly.Lua.finish=function(a){var b=[],c;for(c in Blockly.Lua.definitions_)b.push(Blockly.Lua.definitions_[c]);return b.join("\n\n").replace(/\n\n+/g,"\n\n").replace(/\n*$/,"\n\n\n")+a};
Blockly.Lua.scrubNakedValue=function(a){return a+"\n"};Blockly.Lua.quote_=function(a){a=a.replace(/\\/g,"\\\\").replace(/\n/g,"\\\n").replace(/\%/g,"\\%").replace(/'/g,"\\'");return"'"+a+"'"};
Blockly.Lua.scrub_=function(a,b){if(null===b)return"";var c="";if(!a.outputConnection||!a.outputConnection.targetConnection){var d=a.getCommentText();d&&(c+=this.prefixLines(d,"# ")+"\n");for(var e=0;e<a.inputList.length;e++)a.inputList[e].type==Blockly.INPUT_VALUE&&(d=a.inputList[e].connection.targetBlock())&&(d=this.allNestedComments(d))&&(c+=this.prefixLines(d,"# "))}e=a.nextConnection&&a.nextConnection.targetBlock();e=this.blockToCode(e);return c+b+e};
Blockly.Lua.provideFunction_=function(a,b){if(!Blockly.Lua.definitions_[a]){var c=Blockly.Lua.variableDB_.getDistinctName(a,Blockly.Generator.NAME_TYPE);Blockly.Lua.functionNames_[a]=c;Blockly.Lua.definitions_[a]=b.join("\n").replace(Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_REGEXP_,c)}return Blockly.Lua.functionNames_[a]};Blockly.Lua.colour={};Blockly.Lua.colour_picker=function(a){return["'"+a.getTitleValue("COLOUR")+"'",Blockly.Lua.ORDER_ATOMIC]};Blockly.Lua.colour_random=function(a){return['string.format("#%06x", math.random(0, 2^24 - 1))',Blockly.Lua.ORDER_HIGH]};
Blockly.Lua.colour_rgb=function(a){var b=Blockly.Lua.provideFunction_("colour_rgb",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(r, g, b)","  r = math.floor(math.min(100, math.max(0, r)) * 2.55 + .5)","  g = math.floor(math.min(100, math.max(0, g)) * 2.55 + .5)","  b = math.floor(math.min(100, math.max(0, b)) * 2.55 + .5)",'  return string.format("#%02x%02x%02x", (r, g, b)',"end"]),c=Blockly.Lua.valueToCode(a,"RED",Blockly.Lua.ORDER_NONE)||0,d=Blockly.Lua.valueToCode(a,"GREEN",Blockly.Lua.ORDER_NONE)||
0;a=Blockly.Lua.valueToCode(a,"BLUE",Blockly.Lua.ORDER_NONE)||0;return[b+"("+c+", "+d+", "+a+")",Blockly.Lua.ORDER_HIGH]};
Blockly.Lua.colour_blend=function(a){var b=Blockly.Lua.provideFunction_("colour_blend",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(colour1, colour2, ratio)","  local r1 = tonumber(string.sub(colour1, 2, 3), 16)","  local r2 = tonumber(string.sub(colour2, 2, 3), 16)","  local g1 = tonumber(string.sub(colour1, 4, 5), 16)","  local g2 = tonumber(string.sub(colour2, 4, 5), 16)","  local b1 = tonumber(string.sub(colour1, 6, 7), 16)","  local b2 = tonumber(string.sub(colour2, 6, 7), 16)","  local ratio = math.min(1, math.max(0, ratio))",
"  local r = math.floor(r1 * (1 - ratio) + r2 * ratio + .5)","  local g = math.floor(g1 * (1 - ratio) + g2 * ratio + .5)","  local b = math.floor(b1 * (1 - ratio) + b2 * ratio + .5)",'  return string.format("#%02x%02x%02x", r, g, b)',"end"]),c=Blockly.Lua.valueToCode(a,"COLOUR1",Blockly.Lua.ORDER_NONE)||"'#000000'",d=Blockly.Lua.valueToCode(a,"COLOUR2",Blockly.Lua.ORDER_NONE)||"'#000000'";a=Blockly.Lua.valueToCode(a,"RATIO",Blockly.Lua.ORDER_NONE)||0;return[b+"("+c+", "+d+", "+a+")",Blockly.Lua.ORDER_HIGH]};Blockly.Lua.lists={};Blockly.Lua.lists_create_empty=function(a){return["({})",Blockly.Lua.ORDER_ATOMIC]};Blockly.Lua.lists_create_with=function(a){for(var b=Array(a.itemCount_),c=0;c<a.itemCount_;c++)b[c]=Blockly.Lua.valueToCode(a,"ADD"+c,Blockly.Lua.ORDER_NONE)||"None";b="({"+b.join(", ")+"})";return[b,Blockly.Lua.ORDER_ATOMIC]};
Blockly.Lua.lists_repeat=function(a){var b=Blockly.Lua.valueToCode(a,"ITEM",Blockly.Lua.ORDER_NONE)||"None";a=Blockly.Lua.valueToCode(a,"NUM",Blockly.Lua.ORDER_MULTIPLICATIVE)||"0";return[Blockly.Lua.provideFunction_("create_list_repeated",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(item, count)","  local t = {}","  for i = 1, count do","    table.insert(t, item)","  end","  return t","end"])+"("+b+", "+a+")",Blockly.Lua.ORDER_ATOMIC]};
Blockly.Lua.lists_length=function(a){return["#"+(Blockly.Lua.valueToCode(a,"VALUE",Blockly.Lua.ORDER_NONE)||"[]"),Blockly.Lua.ORDER_HIGH]};Blockly.Lua.lists_isEmpty=function(a){return["#"+(Blockly.Lua.valueToCode(a,"VALUE",Blockly.Lua.ORDER_NONE)||"[]")+" == 0",Blockly.Lua.ORDER_RELATIONAL]};
Blockly.Lua.lists_indexOf=function(a){var b=Blockly.Lua.valueToCode(a,"FIND",Blockly.Lua.ORDER_NONE)||"[]",c=Blockly.Lua.valueToCode(a,"VALUE",Blockly.Lua.ORDER_HIGH)||"''";return[("FIRST"==a.getTitleValue("END")?Blockly.Lua.provideFunction_("first_index",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(t, elem)","  for k, v in ipairs(t) do","    if v == elem then","      return k","    end","  end","  return 0","end"]):Blockly.Lua.provideFunction_("last_index",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+
"(t, elem)","  for i = #t, 1, -1 do","    if t[i] == elem then","      return i","    end","  end","  return 0","end"]))+"("+c+", "+b+")",Blockly.Lua.ORDER_HIGH]};var getIndex_=function(a,b,c){return"FIRST"==b?1:"FROM_END"==b?"#"+a+" + 1 - ("+c+")":"LAST"==b?"#"+a:"RANDOM"==b?"math.random(#"+a+")":c},gensym_counter_=0,gensym_=function(){return"G"+gensym_counter_++};
Blockly.Lua.lists_getIndex=function(a){var b=a.getTitleValue("MODE")||"GET",c=a.getTitleValue("WHERE")||"FROM_START",d=Blockly.Lua.valueToCode(a,"AT",Blockly.Lua.ORDER_ADDITIVE)||"1";a=Blockly.Lua.valueToCode(a,"VALUE",Blockly.Lua.ORDER_NONE)||"nil";if("LAST"!=c&&"FROM_END"!=c&&"RANDOM"!=c||a.match(/^\w+$/)){if("GET"==b)return c=a+"["+getIndex_(a,c,d)+"]",[c,Blockly.Lua.ORDER_HIGH];c="table.remove("+a+", "+getIndex_(a,c,d)+")";return"GET_REMOVE"==b?[c,Blockly.Lua.ORDER_HIGH]:c+"\n"}if("REMOVE"==b)return b=
Blockly.Lua.variableDB_.getDistinctName("tmp_list",Blockly.Variables.NAME_TYPE),c=b+" = "+a+"\ntable.remove("+b+", "+getIndex_(b,c,d)+")\n";c=("GET"==b?Blockly.Lua.provideFunction_("list_get_"+c.toLowerCase()+("FROM_END"==c?"_"+gensym_():""),["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(t)","  return t["+getIndex_("t",c,d)+"]","end"]):Blockly.Lua.provideFunction_("list_remove_"+c.toLowerCase()+("FROM_END"==c?"_"+gensym_():""),["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(t)","  return table.remove(t, "+
getIndex_("t",c,d)+")","end"]))+"("+a+")";return[c,Blockly.Lua.ORDER_HIGH]};
Blockly.Lua.lists_setIndex=function(a){var b=Blockly.Lua.valueToCode(a,"LIST",Blockly.Lua.ORDER_HIGH)||"[]",c=a.getTitleValue("MODE")||"GET",d=a.getTitleValue("WHERE")||"FROM_START",e=Blockly.Lua.valueToCode(a,"AT",Blockly.Lua.ORDER_NONE)||"1";a=Blockly.Lua.valueToCode(a,"TO",Blockly.Lua.ORDER_NONE)||"None";if("LAST"!=d&&"FROM_END"!=d&&"RANDOM"!=d||b.match(/^\w+$/))return b="SET"==c?b+"["+getIndex_(b,d,e)+"] = "+a:"table.insert("+b+", "+(getIndex_(b,d,e)+("LAST"==d?" + 1":""))+", "+a+")",b+"\n";"RANDOM"==
d||"LAST"==d?(c="SET"==c?Blockly.Lua.provideFunction_("list_set_"+d.toLowerCase(),["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(t, val)","  t["+getIndex_("t",d,e)+"] = val","end"]):Blockly.Lua.provideFunction_("list_insert_"+d.toLowerCase(),["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(t, val)","  table.insert(t, "+getIndex_("t",d,e)+("LAST"==d?" + 1":"")+", val)","end"]),b=c+"("+b+", "+a+");\n"):(c="SET"==c?Blockly.Lua.provideFunction_("list_set_from_end",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+
"(t, index, val)","  t[#t + 1 - index] = val","end"]):Blockly.Lua.provideFunction_("list_insert_from_end",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(t, index, val)","  table.insert(t, #t + 1 - index, val)","end"]),b=c+"("+b+", "+e+", "+a+");\n");return b};
Blockly.Lua.lists_add=function(a){var b=Blockly.Lua.variableDB_.getName(a.getTitleValue("VAR"),Blockly.Variables.NAME_TYPE),c=Blockly.Lua.valueToCode(a,"ELEMENT",Blockly.Lua.ORDER_NONE)||"null";return"START"==a.getTitleValue("LOCATION")?"table.insert("+b+", 1, "+c+")\n":"table.insert("+b+", "+c+")\n"};
Blockly.Lua.lists_getSublist=function(a){var b=Blockly.Lua.valueToCode(a,"LIST",Blockly.Lua.ORDER_HIGH)||"[]",c=a.getTitleValue("WHERE1"),d=a.getTitleValue("WHERE2"),e=Blockly.Lua.valueToCode(a,"AT1",Blockly.Lua.ORDER_ADDITIVE)||"1";a=Blockly.Lua.valueToCode(a,"AT2",Blockly.Lua.ORDER_ADDITIVE)||"1";return[Blockly.Lua.provideFunction_("list_sublist_"+gensym_(),["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(source)","  local t = {}","  local start = "+getIndex_("source",c,e),"  local finish = "+
getIndex_("source",d,a),"  for i = start, finish do","    table.insert(t, source[i])","  end","  return t","end"])+"("+b+")",Blockly.Lua.ORDER_HIGH]};Blockly.Lua.logic={};Blockly.Lua.controls_if=function(a){for(var b=0,c=Blockly.Lua.valueToCode(a,"IF"+b,Blockly.Lua.ORDER_NONE)||"False",d=Blockly.Lua.statementToCode(a,"DO"+b)||"",e="if "+c+" then\n"+d,b=1;b<=a.elseifCount_;b++)c=Blockly.Lua.valueToCode(a,"IF"+b,Blockly.Lua.ORDER_NONE)||"False",d=Blockly.Lua.statementToCode(a,"DO"+b)||"",e+="elseif "+c+" then\n"+d;a.elseCount_&&(d=Blockly.Lua.statementToCode(a,"ELSE")||"  pass\n",e+="else\n"+d);return e+"end\n"};
Blockly.Lua.logic_compare=function(a){var b={EQ:"==",NEQ:"~=",LT:"<",LTE:"<=",GT:">",GTE:">="}[a.getTitleValue("OP")],c=Blockly.Lua.ORDER_RELATIONAL,d=Blockly.Lua.valueToCode(a,"A",c)||"0";a=Blockly.Lua.valueToCode(a,"B",c)||"0";return[d+" "+b+" "+a,c]};
Blockly.Lua.logic_operation=function(a){var b="AND"==a.getTitleValue("OP")?"and":"or",c="and"==b?Blockly.Lua.ORDER_AND:Blockly.Lua.ORDER_OR,d=Blockly.Lua.valueToCode(a,"A",c);a=Blockly.Lua.valueToCode(a,"B",c);if(d||a){var e="and"==b?"true":"false";d||(d=e);a||(a=e)}else a=d="false";return[d+" "+b+" "+a,c]};Blockly.Lua.logic_negate=function(a){return["not "+(Blockly.Lua.valueToCode(a,"BOOL",Blockly.Lua.ORDER_UNARY)||"true"),Blockly.Lua.ORDER_UNARY]};
Blockly.Lua.logic_boolean=function(a){return["TRUE"==a.getTitleValue("BOOL")?"true":"false",Blockly.Lua.ORDER_ATOMIC]};Blockly.Lua.logic_null=function(a){return["nil",Blockly.Lua.ORDER_ATOMIC]};Blockly.Lua.logic_ternary=function(a){var b=Blockly.Lua.valueToCode(a,"IF",Blockly.Lua.ORDER_AND)||"false",c=Blockly.Lua.valueToCode(a,"THEN",Blockly.Lua.ORDER_OR)||"nil";a=Blockly.Lua.valueToCode(a,"ELSE",Blockly.Lua.ORDER_OR)||"nil";return[b+" and "+c+" or "+a,Blockly.Lua.ORDER_OR]};Blockly.Lua.loops={};Blockly.Lua.controls_repeat=function(a){var b=parseInt(a.getTitleValue("TIMES"),10);a=Blockly.Lua.statementToCode(a,"DO")||"";return"for "+Blockly.Lua.variableDB_.getDistinctName("count",Blockly.Variables.NAME_TYPE)+"= 1, "+b+" do\n"+a+"end"};
Blockly.Lua.controls_repeat_ext=function(a){var b=Blockly.Lua.valueToCode(a,"TIMES",Blockly.Lua.ORDER_NONE)||"0",b=Blockly.isNumber(b)?parseInt(b,10):"math.floor("+b+")";a=Blockly.Lua.statementToCode(a,"DO")||"\n";return"for "+Blockly.Lua.variableDB_.getDistinctName("count",Blockly.Variables.NAME_TYPE)+" = 1, "+b+" do\n"+a+"end\n"};
Blockly.Lua.controls_whileUntil=function(a){var b="UNTIL"==a.getTitleValue("MODE"),b=Blockly.Lua.valueToCode(a,"BOOL",b?Blockly.Lua.ORDER_UNARY:Blockly.Lua.ORDER_NONE)||"False",c=Blockly.Lua.statementToCode(a,"DO")||"\n";"UNTIL"==a.getTitleValue("MODE")&&(b.match(/^\w+$/)||(b="("+b+")"),b="not "+b);return"while "+b+" do\n"+c+"end\n"};
Blockly.Lua.controls_for=function(a){var b=Blockly.Lua.variableDB_.getName(a.getTitleValue("VAR"),Blockly.Variables.NAME_TYPE),c=Blockly.Lua.valueToCode(a,"FROM",Blockly.Lua.ORDER_NONE)||"0",d=Blockly.Lua.valueToCode(a,"TO",Blockly.Lua.ORDER_NONE)||"0",e=Blockly.Lua.valueToCode(a,"BY",Blockly.Lua.ORDER_NONE)||"1";a=Blockly.Lua.statementToCode(a,"DO")||"\n";b="for "+b+" = "+c+", "+d;Blockly.isNumber(e)&&1==Math.abs(parseFloat(e))||(b+=", "+e);return b+(" do\n"+a+"end\n")};
Blockly.Lua.controls_forEach=function(a){var b=Blockly.Lua.variableDB_.getName(a.getTitleValue("VAR"),Blockly.Variables.NAME_TYPE),c=Blockly.Lua.valueToCode(a,"LIST",Blockly.Lua.ORDER_RELATIONAL)||"[]";a=Blockly.Lua.statementToCode(a,"DO")||"\n";return"for _, "+b+" in ipairs("+c+") do \n"+a+"end\n"};Blockly.Lua.controls_flow_statements=function(a){return"break\n"};Blockly.Lua.math={};Blockly.Lua.math_number=function(a){a=parseFloat(a.getTitleValue("NUM"));return[a,0>a?Blockly.Lua.ORDER_UNARY:Blockly.Lua.ORDER_ATOMIC]};
Blockly.Lua.math_arithmetic=function(a){var b={ADD:[" + ",Blockly.Lua.ORDER_ADDITIVE],MINUS:[" - ",Blockly.Lua.ORDER_ADDITIVE],MULTIPLY:[" * ",Blockly.Lua.ORDER_MULTIPLICATIVE],DIVIDE:[" / ",Blockly.Lua.ORDER_MULTIPLICATIVE],POWER:[" ^ ",Blockly.Lua.ORDER_EXPONENTIATION]}[a.getTitleValue("OP")],c=b[0],b=b[1],d=Blockly.Lua.valueToCode(a,"A",b)||"0";a=Blockly.Lua.valueToCode(a,"B",b)||"0";return[d+c+a,b]};
Blockly.Lua.math_single=function(a){var b=a.getTitleValue("OP");if("NEG"==b)return b=Blockly.Lua.valueToCode(a,"NUM",Blockly.Lua.ORDER_UNARY)||"0",["-"+b,Blockly.Lua.ORDER_UNARY];a="SIN"==b||"COS"==b||"TAN"==b?Blockly.Lua.valueToCode(a,"NUM",Blockly.Lua.ORDER_MULTIPLICATIVE)||"0":Blockly.Lua.valueToCode(a,"NUM",Blockly.Lua.ORDER_NONE)||"0";switch(b){case "ABS":b="math.abs("+a+")";break;case "ROOT":b="math.sqrt("+a+")";break;case "LN":b="math.log("+a+")";break;case "LOG10":b="math.log10("+a+")";break;
case "EXP":b="math.exp("+a+")";break;case "POW10":b="math.pow(10,"+a+")";break;case "ROUND":b="math.floor("+a+" + .5)";break;case "ROUNDUP":b="math.ceil("+a+")";break;case "ROUNDDOWN":b="math.floor("+a+")";break;case "SIN":b="math.sin(math.rad("+a+"))";break;case "COS":b="math.cos(math.rad("+a+"))";break;case "TAN":b="math.tan(math.rad("+a+"))";break;case "ASIN":b="math.deg(math.asin("+a+"))";break;case "ACOS":b="math.deg(math.acos("+a+"))";break;case "ATAN":b="math.deg(math.atan("+a+"))";break;default:throw"Unknown math operator: "+
b;}if(b)return[b,Blockly.Lua.ORDER_HIGH]};Blockly.Lua.math_constant=function(a){var b={PI:["math.pi",Blockly.Lua.ORDER_HIGH],E:["math.exp(1)",Blockly.Lua.ORDER_HIGH],GOLDEN_RATIO:["(1 + math.sqrt(5)) / 2",Blockly.Lua.ORDER_MULTIPLICATIVE],SQRT2:["math.sqrt(2)",Blockly.Lua.ORDER_HIGH],SQRT1_2:["math.sqrt(1 / 2)",Blockly.Lua.ORDER_HIGH],INFINITY:["math.huge",Blockly.Lua.ORDER_HIGH]};a=a.getTitleValue("CONSTANT");return b[a]};
Blockly.Lua.math_number_property=function(a){var b=Blockly.Lua.valueToCode(a,"NUMBER_TO_CHECK",Blockly.Lua.ORDER_MULTIPLICATIVE)||"0",c=a.getTitleValue("PROPERTY"),d;if("PRIME"==c)return d=Blockly.Lua.provideFunction_("isPrime",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(x)","  -- http://stackoverflow.com/questions/11571752/lua-prime-number-checker","  if x < 2 then","    return false","  end","  -- Assume all numbers are prime until proven not-prime.","  local prime = {}","  prime[1] = false",
"  for i = 2, x do","    prime[i] = true","  end","  -- For each prime we find, mark all multiples as not-prime.","  for i = 2, math.sqrt(x) do","    if prime[i] then","      for j = i*i, x, i do","        prime[j] = false","      end","    end","  end","  return prime[x]","end"])+"("+b+")",[d,Blockly.Lua.ORDER_HIGH];switch(c){case "EVEN":d=b+" % 2 == 0";break;case "ODD":d=b+" % 2 == 1";break;case "WHOLE":d=b+" % 1 == 0";break;case "POSITIVE":d=b+" > 0";break;case "NEGATIVE":d=b+" < 0";break;case "DIVISIBLE_BY":a=
Blockly.Lua.valueToCode(a,"DIVISOR",Blockly.Lua.ORDER_MULTIPLICATIVE);if(!a||"0"==a)return["nil",Blockly.Lua.ORDER_ATOMIC];d=b+" % "+a+" == 0"}return[d,Blockly.Lua.ORDER_RELATIONAL]};Blockly.Lua.math_change=function(a){var b=Blockly.Lua.valueToCode(a,"DELTA",Blockly.Lua.ORDER_ADDITIVE)||"0";a=Blockly.Lua.variableDB_.getName(a.getTitleValue("VAR"),Blockly.Variables.NAME_TYPE);return a+" = "+a+" + "+b+"\n"};Blockly.Lua.math_round=Blockly.Lua.math_single;Blockly.Lua.math_trig=Blockly.Lua.math_single;
Blockly.Lua.math_on_list=function(a){function b(){return Blockly.Lua.provideFunction_("sum",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(t)","  local result = 0","  for k,v in ipairs(t) do","    result = result + v","  end","  return result","end"])}var c=a.getTitleValue("OP");a=Blockly.Lua.valueToCode(a,"LIST",Blockly.Lua.ORDER_NONE)||"{}";switch(c){case "RANDOM":return["#"+a+" == 0 and nil or "+a+"[math.random(#"+a+")]",Blockly.Lua.ORDER_HIGH];case "AVERAGE":return["#"+a+" == 0 and 0 or "+
b()+"("+a+") / #"+a,Blockly.Lua.ORDER_HIGH];case "SUM":c=b();break;case "MIN":c=Blockly.Lua.provideFunction_("min",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(t)","  local result = math.huge","  for k,v in ipairs(t) do","    if v < result then","      result = v","    end","  end","  return result","end"]);break;case "MAX":c=Blockly.Lua.provideFunction_("max",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(t)","  local result = 0","  for k,v in ipairs(t) do","    if v > result then",
"      result = v","    end","  end","  return result","end"]);break;case "MEDIAN":c=Blockly.Lua.provideFunction_("math_median",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(t)","  -- Source: http://lua-users.org/wiki/SimpleStats","  local temp={}","  for k,v in ipairs(t) do",'    if type(v) == "number" then',"      table.insert( temp, v )","    end","  end","  table.sort( temp )","  if math.fmod(#temp,2) == 0 then","    return ( temp[#temp/2] + temp[(#temp/2)+1] ) / 2","  else","    return temp[math.ceil(#temp/2)]",
"  end","end"]);break;case "MODE":c=Blockly.Lua.provideFunction_("math_modes",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(t)","  -- Source: http://lua-users.org/wiki/SimpleStats","  local counts={}","  for k, v in ipairs( t ) do","    if counts[v] == nil then","      counts[v] = 1","    else","      counts[v] = counts[v] + 1","    end","  end","  local biggestCount = 0","  for k, v  in ipairs( counts ) do","    if v > biggestCount then","      biggestCount = v","    end","  end","  local temp={}",
"  for k,v in ipairs( counts ) do","    if v == biggestCount then","      table.insert( temp, k )","    end","  end","  return temp","end"]);break;case "STD_DEV":c=Blockly.Lua.provideFunction_("math_standard_deviation",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(t)","  local m","  local vm","  local total = 0","  local count = 0","  local result","  m = #t == 0 and 0 or "+b()+"(t) / #t","  for k,v in ipairs(t) do","    if type(v) == 'number' then","      vm = v - m","      total = total + (vm * vm)",
"      count = count + 1","    end","  end","  result = math.sqrt(total / (count-1))","  return result","end"]);break;default:throw"Unknown operator: "+c;}return[c+"("+a+")",Blockly.Lua.ORDER_HIGH]};Blockly.Lua.math_modulo=function(a){var b=Blockly.Lua.valueToCode(a,"DIVIDEND",Blockly.Lua.ORDER_MULTIPLICATIVE)||"0";a=Blockly.Lua.valueToCode(a,"DIVISOR",Blockly.Lua.ORDER_MULTIPLICATIVE)||"0";return[b+" % "+a,Blockly.Lua.ORDER_MULTIPLICATIVE]};
Blockly.Lua.math_constrain=function(a){var b=Blockly.Lua.valueToCode(a,"VALUE",Blockly.Lua.ORDER_NONE)||"0",c=Blockly.Lua.valueToCode(a,"LOW",Blockly.Lua.ORDER_NONE)||"0";a=Blockly.Lua.valueToCode(a,"HIGH",Blockly.Lua.ORDER_NONE)||"math.huge";return["math.min(math.max("+b+", "+c+"), "+a+")",Blockly.Lua.ORDER_HIGH]};
Blockly.Lua.math_random_int=function(a){var b=Blockly.Lua.valueToCode(a,"FROM",Blockly.Lua.ORDER_NONE)||"0";a=Blockly.Lua.valueToCode(a,"TO",Blockly.Lua.ORDER_NONE)||"0";return["math.random("+b+", "+a+")",Blockly.Lua.ORDER_HIGH]};Blockly.Lua.math_random_float=function(a){return["math.random()",Blockly.Lua.ORDER_HIGH]};Blockly.Lua.procedures={};
Blockly.Lua.procedures_defreturn=function(a){var b=Blockly.Lua.variableDB_.getName(a.getTitleValue("NAME"),Blockly.Procedures.NAME_TYPE),c=Blockly.Lua.statementToCode(a,"STACK");Blockly.Lua.INFINITE_LOOP_TRAP&&(c=Blockly.Lua.INFINITE_LOOP_TRAP.replace(/%1/g,'"'+a.id+'"')+c);var d=Blockly.Lua.valueToCode(a,"RETURN",Blockly.Lua.ORDER_NONE)||"";d?d="  return "+d+"\n":c||(c="");for(var e=[],f=0;f<a.arguments_.length;f++)e[f]=Blockly.Lua.variableDB_.getName(a.arguments_[f],Blockly.Variables.NAME_TYPE);c=
"function "+b+"("+e.join(", ")+")\n"+c+d+"end\n";c=Blockly.Lua.scrub_(a,c);Blockly.Lua.definitions_[b]=c;return null};Blockly.Lua.procedures_defnoreturn=Blockly.Lua.procedures_defreturn;Blockly.Lua.procedures_callreturn=function(a){for(var b=Blockly.Lua.variableDB_.getName(a.getTitleValue("NAME"),Blockly.Procedures.NAME_TYPE),c=[],d=0;d<a.arguments_.length;d++)c[d]=Blockly.Lua.valueToCode(a,"ARG"+d,Blockly.Lua.ORDER_NONE)||"None";return[b+"("+c.join(", ")+")",Blockly.Lua.ORDER_HIGH]};
Blockly.Lua.procedures_callnoreturn=function(a){for(var b=Blockly.Lua.variableDB_.getName(a.getTitleValue("NAME"),Blockly.Procedures.NAME_TYPE),c=[],d=0;d<a.arguments_.length;d++)c[d]=Blockly.Lua.valueToCode(a,"ARG"+d,Blockly.Lua.ORDER_NONE)||"None";return b+"("+c.join(", ")+")\n"};
Blockly.Lua.procedures_ifreturn=function(a){var b="if "+(Blockly.Lua.valueToCode(a,"CONDITION",Blockly.Lua.ORDER_NONE)||"False")+" then\n";a.hasReturnValue_?(a=Blockly.Lua.valueToCode(a,"VALUE",Blockly.Lua.ORDER_NONE)||"None",b+="  return "+a+"\n"):b+="  return\n";return b+"end\n"};Blockly.Lua.text={};Blockly.Lua.text=function(a){return[Blockly.Lua.quote_(a.getTitleValue("TEXT")),Blockly.Lua.ORDER_ATOMIC]};
Blockly.Lua.text_join=function(a){var b;if(0==a.itemCount_)return["''",Blockly.Lua.ORDER_ATOMIC];if(1==a.itemCount_)return b=Blockly.Lua.valueToCode(a,"ADD0",Blockly.Lua.ORDER_NONE)||"''",[b,Blockly.Lua.ORDER_HIGH];if(2==a.itemCount_)return b=Blockly.Lua.valueToCode(a,"ADD0",Blockly.Lua.ORDER_NONE)||"''",a=Blockly.Lua.valueToCode(a,"ADD1",Blockly.Lua.ORDER_NONE)||"''",[b+" .. "+a,Blockly.Lua.ORDER_UNARY];b=[];for(var c=0;c<a.itemCount_;c++)b[c]=Blockly.Lua.valueToCode(a,"ADD"+c,Blockly.Lua.ORDER_NONE)||
"''";b="table.concat({"+b.join(", ")+"})";return[b,Blockly.Lua.ORDER_HIGH]};Blockly.Lua.text_append=function(a){var b=Blockly.Lua.variableDB_.getName(a.getTitleValue("VAR"),Blockly.Variables.NAME_TYPE);a=Blockly.Lua.valueToCode(a,"TEXT",Blockly.Lua.ORDER_NONE)||"''";return b+" = "+b+" .. "+a+"\n"};Blockly.Lua.text_length=function(a){return["string.len("+(Blockly.Lua.valueToCode(a,"VALUE",Blockly.Lua.ORDER_NONE)||"''")+")",Blockly.Lua.ORDER_HIGH]};
Blockly.Lua.text_isEmpty=function(a){return["string.len("+(Blockly.Lua.valueToCode(a,"VALUE",Blockly.Lua.ORDER_NONE)||"''")+") == 0",Blockly.Lua.ORDER_RELATIONAL]};
Blockly.Lua.text_indexOf=function(a){var b=Blockly.Lua.valueToCode(a,"FIND",Blockly.Lua.ORDER_NONE)||"''",c=Blockly.Lua.valueToCode(a,"VALUE",Blockly.Lua.ORDER_HIGH)||"''";return[("FIRST"==a.getTitleValue("END")?Blockly.Lua.provideFunction_("firstIndexOf",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(str, substr) ","  local i = string.find(str, substr, 1, true)","  if i == nil then","    return 0","  else","    return i","  end","end"]):Blockly.Lua.provideFunction_("lastIndexOf",["function "+
Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(str, substr)","  for i = string.len(str) - string.len(substr) + 1, 1, -1 do","    if string.find(str, substr, i, true) then","      return i","    end","  end","  return 0","end"]))+"("+c+", "+b+")",Blockly.Lua.ORDER_HIGH]};
Blockly.Lua.text_charAt=function(a){var b=a.getTitleValue("WHERE")||"FROM_START",c=Blockly.Lua.valueToCode(a,"VALUE",Blockly.Lua.ORDER_HIGH)||"''";if("RANDOM"==b)c=Blockly.Lua.provideFunction_("text_random_letter",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(str)","  local index = math.random(string.len(str))","  return string.sub(index, index)","end"])+"("+c+")";else{if("FIRST"==b)b=1;else if("LAST"==b)b=-1;else if(a=Blockly.Lua.valueToCode(a,"AT",Blockly.Lua.ORDER_UNARY)||"1","FROM_START"==
b)b=a;else if("FROM_END"==b)b="-"+a;else throw"Unhandled option (text_charAt).";c="string.sub("+c+", "+b+", "+b+")"}return[c,Blockly.Lua.ORDER_HIGH]};
Blockly.Lua.text_getSubstring=function(a){var b=Blockly.Lua.valueToCode(a,"STRING",Blockly.Lua.ORDER_HIGH)||"''",c=a.getTitleValue("WHERE1"),d=Blockly.Lua.valueToCode(a,"AT1",Blockly.Lua.ORDER_ADDITIVE)||"1";if("FIRST"==c)c=1;else if("FROM_START"==c)c=d;else if("FROM_END"==c)c="-"+d;else throw"Unhandled option (text_getSubstring)";d=a.getTitleValue("WHERE2");a=Blockly.Lua.valueToCode(a,"AT2",Blockly.Lua.ORDER_ADDITIVE)||"1";if("LAST"==d)a=-1;else if("FROM_START"!=d)if("FROM_END"==d)a="-"+a;else throw"Unhandled option (text_getSubstring)";
return["string.sub("+b+", "+c+", "+a+")",Blockly.Lua.ORDER_HIGH]};
Blockly.Lua.text_changeCase=function(a){var b=a.getTitleValue("CASE");a=Blockly.Lua.valueToCode(a,"TEXT",Blockly.Lua.ORDER_HIGH)||"''";if("UPPERCASE"==b)var c="string.upper";else"LOWERCASE"==b?c="string.lower":"TITLECASE"==b&&(c=Blockly.Lua.provideFunction_("text_titlecase",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(str)","  local buf = {}","  local inWord = false","  for i = 1, #str do","    local c = string.sub(str, i, i)","    if inWord then","      table.insert(buf, string.lower(c))",
'      if string.find(c, "%s") then',"        inWord = false","      end","    else","      table.insert(buf, string.upper(c))","      inWord = true","    end","  end","  return table.concat(buf)","end"]));return[c+"("+a+")",Blockly.Lua.ORDER_HIGH]};Blockly.Lua.text_trim=function(a){var b={LEFT:"^%s*(,-)",RIGHT:"(.-)%s*$",BOTH:"^%s*(.-)%s*$"}[a.getTitleValue("MODE")];return["string.gsub("+(Blockly.Lua.valueToCode(a,"TEXT",Blockly.Lua.ORDER_HIGH)||"''")+', "'+b+'", "%1")',Blockly.Lua.ORDER_HIGH]};
Blockly.Lua.text_print=function(a){return"print("+(Blockly.Lua.valueToCode(a,"TEXT",Blockly.Lua.ORDER_NONE)||"''")+")\n"};Blockly.Lua.text_prompt=function(a){var b=Blockly.Lua.provideFunction_("text_prompt",["function "+Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_+"(msg)","  io.write(msg)","  io.flush()","  return io.read()","end"]);a=Blockly.Lua.quote_(a.getTitleValue("TEXT"));return[b+"("+a+")",Blockly.Lua.ORDER_HIGH]};Blockly.Lua.variables={};Blockly.Lua.variables_get=function(a){return[Blockly.Lua.variableDB_.getName(a.getTitleValue("VAR"),Blockly.Variables.NAME_TYPE),Blockly.Lua.ORDER_ATOMIC]};Blockly.Lua.variables_set=function(a){var b=Blockly.Lua.valueToCode(a,"VALUE",Blockly.Lua.ORDER_NONE)||"0";return Blockly.Lua.variableDB_.getName(a.getTitleValue("VAR"),Blockly.Variables.NAME_TYPE)+" = "+b+"\n"};
Blockly.Lua.variables_set_two=function(a){var b=Blockly.Lua.valueToCode(a,"VALUE",Blockly.Lua.ORDER_NONE)||"nil, nil",c=Blockly.Lua.variableDB_.getName(a.getTitleValue("VAR1"),Blockly.Variables.NAME_TYPE);a=Blockly.Lua.variableDB_.getName(a.getTitleValue("VAR2"),Blockly.Variables.NAME_TYPE);return c+", "+a+" = "+b+"\n"};
Blockly.Lua.variables_set_three=function(a){var b=Blockly.Lua.valueToCode(a,"VALUE",Blockly.Lua.ORDER_NONE)||"nil, nil, nil",c=Blockly.Lua.variableDB_.getName(a.getTitleValue("VAR1"),Blockly.Variables.NAME_TYPE),d=Blockly.Lua.variableDB_.getName(a.getTitleValue("VAR2"),Blockly.Variables.NAME_TYPE);a=Blockly.Lua.variableDB_.getName(a.getTitleValue("VAR3"),Blockly.Variables.NAME_TYPE);return c+", "+d+", "+a+" = "+b+"\n"};

Blockly.Lua['new_value'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'new';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Lua.ORDER_ATOMIC];
};
Blockly.Lua['old_value'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'old';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Lua.ORDER_ATOMIC];
};