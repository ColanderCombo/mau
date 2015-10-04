-- // This program is free software: you can redistribute it and/or modify
-- // it under the condition that it is for private or home useage and 
-- // this whole comment is reproduced in the source code file.
-- // Commercial utilisation is not authorized without the appropriate
-- // written agreement from amg0 / alexis . mermet @ gmail . com
-- // This program is distributed in the hope that it will be useful,
-- // but WITHOUT ANY WARRANTY; without even the implied warranty of
-- // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

-- AKbooer contribution

local json = require("L_ALTUIjson")
local printResult = {}

function table.pack(...)
  return { n = select("#", ...), ... }
end

function myPrint (...)
	local arg = table.pack(...)
	for i = 1,arg.n do
		arg[i] = tostring(arg[i])
	end
	table.insert (printResult, table.concat (arg, "\t"))
end

function _G.ALTUI_LuaRunHandler(lul_request, lul_parameters, lul_outputformat)
	-- res="1||all is ok||all is ok"
	-- return res, "text/plain"
	local lua = lul_parameters["lua"]
	luup.log(string.format("ALTUI: runLua(%s)",lua),50)
	
	-- prepare print result and override print function
	printResult = {}
	local old = _G.print
	_G.print = myPrint
	
	-- prepare execution 
	local errcode = 0
	local results = nil
	local f,msg = loadstring(lua)
	if (f==nil) then
		luup.log(string.format("ALTUI: loadstring %s failed to compile, msg=%s",lua,msg),1)
	else
		results = f()	-- call it
		luup.log(string.format("ALTUI: Evaluation of lua code returned: %s",json.encode(results)),50)
		errcode=1
	end
	_G.print = old
	
	printResult = table.concat (printResult, "\n")
	return string.format("%d||%s||%s",errcode,json.encode(results),printResult);
end

luup.register_handler('ALTUI_LuaRunHandler','ALTUI_LuaRunHandler')