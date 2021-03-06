// Generated by CoffeeScript 1.10.0
(function() {
  var MultiBox;

  MultiBox = (function() {
    function MultiBox() {}

    MultiBox.devicetypesDB = {
      0: {}
    };

    MultiBox.controllers = [
      {
        ip: '',
        controller: null
      }
    ];

    MultiBox._exec = function(device, f) {
      var elems;
      if (device == null) {
        return null;
      }
      elems = device.altuiid.split('-');
      if (this.controllers[elems[0]] == null) {
        return null;
      } else {
        return f(this.controllers[elems[0]].controller);
      }
    };

    MultiBox._execWithId = function(device, f) {
      var elems;
      if (device == null) {
        return null;
      }
      elems = device.altuiid.split('-');
      if (this.controllers[elems[0]] == null) {
        return null;
      } else {
        return f(this.controllers[elems[0]].controller, elems[1]);
      }
    };

    MultiBox._union = function(f) {
      var arr, c, i, j, len, ref, results;
      arr = [];
      ref = this.controllers;
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        c = ref[i];
        results.push(arr = arr.concat(f(c)));
      }
      return results;
    };

    MultiBox._unionSorted = function(f) {
      return this._union(f).sort(altuiSortByName);
    };

    MultiBox.controllerOf = function(altuiid) {
      var elems;
      elems = altuiid.split("-");
      return {
        controller: parseInt(elems[0]),
        id: elems[1]
      };
    };

    MultiBox.makeAltuiid = function(ctrlid, devid) {
      return ctrlid + "-" + devid;
    };

    MultiBox.getControllers = function() {
      return $.map(this.controllers, function(c) {
        return {
          ip: c.ip,
          box_info: c.controller.getBoxFullInfo(),
          controller: c.controller
        };
      });
    };

    MultiBox.initDB = function(devicetypes) {
      $.extend(true, this.devicetypesDB[0], devicetypes);
      return this;
    };

    MultiBox.getALTUITypesDB = function() {
      return this.devicetypesDB[0];
    };

    MultiBox.getDeviceTypesDB = function(controllerid) {
      return this.devicetypesDB[controllerid || 0];
    };

    MultiBox.addDeviceType = function(controllerid, devtype, obj) {
      var id;
      id = controllerid || 0;
      if (this.devicetypesDB[id][devtype] == null) {
        this.devicetypesDB[id][devtype] = {};
      }
      return $.extend(true, this.devicetypesDB[id][devtype], obj);
    };

    MultiBox.updateDeviceTypeUPnpDB = function(controllerid, devtype, Dfilename) {
      if (this.devicetypesDB[id][devtype].Dfilename == null) {
        this.devicetypesDB[id][devtype].Dfilename = Dfilename;
        if (this.devicetypesDB[id][devtype].Dfilename == null) {
          this.devicetypesDB[id][devtype].Dfilename = Ffilename;
          return FileDB.getFileContent(id, Dfilename, function(xmlstr, jqXHR) {
            var Sfilenames, doc, e, error, imp, serviceIDs, xml;
            try {
              if (jqXHR) {
                if (jqXHR.responseXML != null) {
                  doc = jqXHR.responseXML;
                } else {
                  doc = $.parseXML(xmlstr);
                }
              } else {
                doc = $.parseXML(xmlstr);
              }
              xml = $(doc);
              imp = xml.find("implementationFile");
              this.devicetypesDB[id][devtype].Ifilename = imp.text();
              this.devicetypesDB[id][devtype].Services = [];
              serviceIDs = xml.find("serviceId");
              Sfilenames = xml.find("SCPDURL");
              return xml.find("serviceId").each(function(index, value) {
                return this.devicetypesDB[id][devtype].Services.push({
                  ServiceId: $(value).text(),
                  SFilename: $(Sfilenames[index]).text(),
                  Actions: []
                });
              });
            } catch (error) {
              e = error;
              console.log("error in xml parsing, Dfile: " + Dfilename);
              return console.log("xmlstr " + xmlstr);
            }
          });
        }
      }
    };

    MultiBox.updateDeviceTypeUIDB = function(controllerid, devtype, ui_definitions) {
      var json;
      if (this.devicetypesDB[controllerid] == null) {
        this.devicetypesDB[controllerid] = {};
      }
      if (this.devicetypesDB[controllerid][devtype] == null) {
        this.devicetypesDB[controllerid][devtype] = {};
      }
      json = ui_definitions.device_json || 'nil';
      if (this.devicetypesDB[controllerid][devtype][json] == null) {
        this.devicetypesDB[controllerid][devtype][json] = {};
      }
      return this.devicetypesDB[controllerid][devtype][json].ui_static_data = ui_definitions;
    };

    MultiBox.getDeviceStaticData = function(device) {
      var elems, json;
      if ((device == null) || (device.device_type == null)) {
        return null;
      }
      elems = device.altuiid.split('-');
      json = device.device_json || 'nil';
      if (this.devicetypesDB[elems[0]][device.device_type][json] == null) {
        if (this.devicetypesDB[elems[0]][device.device_type]['nil'] != null) {
          return this.devicetypesDB[elems[0]][device.device_type]['nil'].ui_static_data;
        }
        AltuiDebug.debug("_getDeviceStaticData(" + device.altuiid + ") does not find static data");
        AltuiDebug.debug(("_devicetypesDB[" + elems[0] + "][" + device.device_type + "]=") + JSON.stringify(_devicetypesDB[elems[0]][device.device_type]));
        return null;
      }
      return this.devicetypesDB[elems[0]][device.device_type][json].ui_static_data;
    };

    MultiBox.getAllEvents = function(name) {
      return $.map(this.controllers, function(o, i) {
        return "${name}_${i}";
      });
    };

    MultiBox.initEngine = function(extraController, firstuserdata) {
      var _AllLoaded, box, idx, ipaddr, j, k, len, len1, ref, ref1, results;
      _AllLoaded = function(eventname) {
        switch (eventname) {
          case "on_ui_userDataLoaded":
            UIManager.refreshUI(true, true);
            break;
          case "on_ui_userDataFirstLoaded":
            null;
        }
        return EventBus.publishEvent(eventname);
      };
      EventBus.waitForAll("on_ui_userDataFirstLoaded", this.getAllEvents("on_ui_userDataFirstLoaded"), this, this.AllLoaded);
      EventBus.waitForAll("on_ui_userDataLoaded", this.getAllEvents("on_ui_userDataLoaded"), this, this.AllLoaded);
      this.controllers[0].controller = new VeraBox(0, '');
      this.controllers[0].controller.initEngine(firstuserdata);
      if (extraController.trim().length > 0) {
        ref = extraController.split(',');
        for (idx = j = 0, len = ref.length; j < len; idx = ++j) {
          ipaddr = ref[idx];
          this.controllers.push({
            ip: ipaddr.trim(),
            controller: null
          });
        }
        ref1 = this.controllers;
        results = [];
        for (idx = k = 0, len1 = ref1.length; k < len1; idx = ++k) {
          box = ref1[idx];
          if (this.devicetypesDB[idx] == null) {
            this.devicetypesDB[idx] = {};
          }
          if (box.controller == null) {
            box.controller = new VeraBox(idx, box.ip);
            results.push(box.controller.initEngine());
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    MultiBox.saveEngine = function() {
      var box, j, len, ref, results;
      ref = this.controllers;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        box = ref[j];
        results.push(box.controller.saveEngine());
      }
      return results;
    };

    MultiBox.clearEngine = function() {
      var box, j, len, ref, results;
      ref = this.controllers;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        box = ref[j];
        results.push(box.controller.clearEngine());
      }
      return results;
    };

    MultiBox.getUrlHead = function(altuiid) {
      return this._exec(altuiid, function(c) {
        return c.getUrlHead();
      });
    };

    MultiBox.getIpAddr = function(altuiid) {
      return this._exec(altuiid, function(c) {
        return c.getIpAddr();
      });
    };

    MultiBox.isUI5 = function(controller) {
      if (controller == null) {
        return this.devicetypesDB[0]['info'].ui7Check === false;
      }
      return this.controllers[controller].controller.isUI5();
    };

    MultiBox.getDataProviders = function(cbfunc) {
      return this.controllers[0].controller.getDataProviders(cbfunc);
    };

    MultiBox.initializeJsonp = function(controller) {
      return this.controllers[controller].controller.initializeJsonp();
    };

    MultiBox.initializeSysinfo = function(controller) {
      return this.controllers[controller].controller.initializeSysinfo();
    };

    MultiBox.setHouseMode = function(newmode, cbfunc) {
      return this.controllers[0].controller.setHouseMode(newmode, cbfunc);
    };

    MultiBox.getHouseModeSwitchDelay = function() {
      return this.controllers[0].controller.getHouseModeSwitchDelay();
    };

    MultiBox.getRooms = function(func, filterfunc, endfunc) {
      var answers, arr, c, dfd, i, j, len, ref;
      dfd = $.Deferred();
      arr = [];
      answers = 0;
      ref = this.controllers;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        c = ref[i];
        c.controller.getRooms(function(idx, room) {
          var index;
          index = arr.length;
          arr.push(room);
          if ($.isFunction(func)) {
            return func(index, room);
          }
        }, filterfunc, function(rooms) {
          var result;
          answers++;
          if (answers === this.controllers.length) {
            result = arr.sort(altuiSortByName);
            if ($.isFunction(endfunc)) {
              endfunc(result);
            }
            return dfd.resolve(result);
          }
        });
      }
      return dfd.promise();
    };

    MultiBox.getRoomsSync = function() {
      return this._unionSorted(function(c) {
        return c.getRoomsSync();
      });
    };

    MultiBox.getRoomByID = function(controllerid, roomid) {
      return this.controllers[controllerid].controller.getRoomByID(roomid);
    };

    MultiBox.getRoomByAltuiID = function(altuiid) {
      return this._execWithId(altuiid, function(c, id) {
        return c.getRoomByID(id);
      });
    };

    MultiBox.getUsers = function(func, filterfunc, endfunc) {
      var answers, arr, c, i, j, len, ref;
      arr = [];
      answers = 0;
      ref = this.controllers;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        c = ref[i];
        c.controller.getUsers(function(idx, room) {
          var index;
          index = arr.length;
          arr.push(room);
          if ($.isFunction(func)) {
            return func(index, user);
          }
        }, filterfunc, function(users) {
          answers++;
          if (answers === this.controllers.length) {
            if ($.isFunction(endfunc)) {
              return endfunc(arr.sort(altuiSortByName2));
            }
          }
        });
      }
      return this.getUsersSync();
    };

    MultiBox.getUsersSync = function(controllerid) {
      var arr, c, i, j, len, ref;
      arr = [];
      if (controllerid != null) {
        arr = arr.concat(this.controllers[controllerid].controller.getUsersSync());
      } else {
        ref = this.controllers;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          c = ref[i];
          arr = arr.concat(c.controller.getUsersSync());
        }
      }
      return arr.sort(altuiSortByName2);
    };

    MultiBox.getUserByID = function(controllerid, userid) {
      return this.controllers[controllerid].controller.getUserByID(user);
    };

    MultiBox.getMainUser = function() {
      var usrs;
      usrs = this.controllers[0].controller.getUsersSync();
      if ((usrs != null) && users.length >= 1) {
        return usrs[0];
      }
      return null;
    };

    MultiBox.deleteRoom = function(room) {
      return this._execWithId(room, function(c, id) {
        return c.deleteRoom(id);
      });
    };

    MultiBox.createRoom = function(controllerid, name, cbfunc) {
      return this.controllers[controllerid].controller.createRoom(name, cbfunc);
    };

    MultiBox.renameRoom = function(room, name) {
      return this._execWithId(room, function(c, id) {
        return c.renameRoom(id, name);
      });
    };

    MultiBox.createDevice = function(controllerid, param, cbfunc) {
      var id;
      id = controllerid || 0;
      return this.controllers[i].controller.createDevice(param, function(newid) {
        return cbfunc(id + "-" + newid);
      });
    };

    MultiBox.renameDevice = function(device, newname, roomid) {
      return this._exec(device, function(c) {
        return c.renameDevice(device, newname, roomid);
      });
    };

    MultiBox.deleteDevice = function(device) {
      var idx, j, k, len, len1, ref, ref1, watch, whichwatch;
      ref = ["VariablesToSend", "VariablesToWatch"];
      for (idx = j = 0, len = ref.length; j < len; idx = ++j) {
        whichwatch = ref[idx];
        ref1 = MultiBox.getWatches(whichwatch, function(w) {
          return w.deviceid === device.altuiid;
        });
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          watch = ref1[k];
          MultiBox.delWatch(watch);
        }
      }
      return this._execWithId(device, function(c, id) {
        return c.deleteDevice(id);
      });
    };

    MultiBox.getDevices = function(func, filterfunc, endfunc) {
      var answers, arr, c, i, j, len, ref;
      arr = [];
      answers = 0;
      ref = this.controllers;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        c = ref[i];
        c.controller.getDevices(func, filterfunc, function(devices) {
          arr = arr.concat(devices);
          answers++;
          if (answers === this.controllers.length && $.isFunction(endfunc)) {
            return endfunc(arr);
          }
        });
      }
      return arr;
    };

    MultiBox.getDevicesSync = function() {
      return this._union(function(c) {
        return c.getDevicesSync();
      });
    };

    MultiBox.getDeviceBatteryLevel = function(device) {
      return this._exec(device, function(c) {
        return c.getDeviceBatteryLevel(device);
      });
    };

    MultiBox.getDeviceByAltuiID = function(devid) {
      return this._execWithId(devid, function(c, id) {
        return getDeviceByID(id);
      });
    };

    MultiBox.getDeviceByID = function(controllerid, devid) {
      if (this.controllers[controllerid] == null) {
        return null;
      } else {
        return this.controllers[controllerid].controller.getDeviceByID(devid);
      }
    };

    MultiBox.getDeviceByAltID = function(controllerid, parentdevid, altid) {
      var id;
      id = controllerid || 0;
      return this.controllers[id].controller.getDeviceByAltID(parentdevid, altid);
    };

    MultiBox.getDeviceByType = function(str) {
      return this.controllers[0].controller.getDeviceByType(str);
    };

    MultiBox.getDeviceActions = function(device, cbfunc) {
      if (device == null) {
        cbfunc([]);
        return [];
      } else {
        return this._exec(device, function(c) {
          return c.getDeviceActions(device, cbfunc);
        });
      }
    };

    MultiBox.getDeviceEvents = function(device) {
      return this._exec(device, function(c) {
        return c.getDeviceEvents(device);
      });
    };

    MultiBox.getDeviceDependants = function(device) {
      return this._exec(device, function(c) {
        return c.getDeviceDependants(device);
      });
    };

    MultiBox.getDeviceVariableHistory = function(device, varidx, cbfunc) {
      return this._exec(device, function(c) {
        return c.getDeviceVariableHistory(device, varidx, cbfunc);
      });
    };

    MultiBox.delWatch = function(w) {
      w = $.extend({
        scene: -1,
        expression: 'true',
        xml: '',
        provider: ''
      }, w);
      return this.controllers['0'].controller.delWatch(w);
    };

    MultiBox.addWatch = function(w) {
      w = $.extend({
        scene: -1,
        expression: 'true',
        xml: '',
        provider: ''
      }, w);
      return this.controllers['0'].controller.addWatch(w);
    };

    MultiBox.getWatches = function(whichwatches, filterfunc) {
      if (whichwatches !== "VariablesToWatch" && whichwatches !== "VariablesToSend") {
        return null;
      }
      return this.controllers['0'].controller.getWatches(whichwatches, filterfunc);
    };

    MultiBox.getStatesByAltuiID = function(altuiid) {
      return this._execWithId(altuiid, function(c, id) {
        return c.getStates(id);
      });
    };

    MultiBox.getStateByID = function(altuiid, id) {
      var idx, j, len, state, states;
      id = parseInt(id);
      states = this.getStatesByAltuiID(altuiid);
      for (idx = j = 0, len = states.length; j < len; idx = ++j) {
        state = states[idx];
        if (state.id === id) {
          return state;
        }
      }
      return null;
    };

    MultiBox.getStates = function(device) {
      return this._execWithId(device, function(c, id) {
        return c.getStates(id);
      });
    };

    MultiBox.getStatus = function(device, service, variable) {
      return this._execWithId(device, function(c, id) {
        return c.getStatus(id, service, variable);
      });
    };

    MultiBox.setStatus = function(device, service, variable, value, dynamic) {
      return this._execWithId(device, function(c, id) {
        return c.setStatus(id, service, variable, value, dynamic);
      });
    };

    MultiBox.getJobStatus = function(controllerid, jobid, cbfunc) {
      if (this.controllers[controllerid] == null) {
        return this.controllers[controllerid].controller.getJobStatus(jobid, cbfunc);
      }
    };

    MultiBox.runAction = function(device, service, action, params, cbfunc) {
      return this._execWithId(device, function(c, id) {
        return c.getUPnPHelper().UPnPAction(id, service, action, params, cbfunc);
      });
    };

    MultiBox.runActionByAltuiID = function(altuiid, service, action, params, cbfunc) {
      return this._execWithId(altuiid, function(c, id) {
        return c.getUPnPHelper().UPnPAction(id, service, action, params, cbfunc);
      });
    };

    MultiBox.setAttr = function(device, attribute, value, cbfunc) {
      return this._execWithId(device, function(c, id) {
        return c.setAttr(id, attribute, value, cbfunc);
      });
    };

    MultiBox.isDeviceZwave = function(device) {
      return this._exec(device, function(c) {
        return c.isDeviceZwave(device);
      });
    };

    MultiBox.updateNeighbors = function(device) {
      return this._execWithId(device, function(c, id) {
        return c.updateNeighbors(id);
      });
    };

    MultiBox.setColor = function(device, hex) {
      return this._execWithId(device, function(c, id) {
        return c.setColor(id, hex);
      });
    };

    MultiBox.getCategories = function(cbfunc, filterfunc, endfunc) {
      var answers, arr, c, dfd, idx, index, j, len, ref;
      dfd = $.Deferred();
      arr = [];
      answers = 0;
      ref = this.controllers;
      for (idx = j = 0, len = ref.length; j < len; idx = ++j) {
        c = ref[idx];
        index = idx;
        c.controller.getCategories(function(idx, cat) {
          index = arr.length;
          if ($.inArray(cat.name, $.map(arr, (function(e) {
            return e.name;
          })) === -1)) {
            return arr.push(cat);
          }
        }, filterfunc, function(categories) {
          var arr2;
          answers++;
          if (answers === this.controllers.length) {
            arr2 = arr.sort(altuiSortByName);
            if ($.isFunction(cbfunc)) {
              $.each(arr2, cbfunc);
            }
            if ($.isFunction(endfunc)) {
              endfunc(arr2);
            }
            return dfd.resolve(categories);
          }
        });
      }
      return dfd.promise();
    };

    MultiBox.getCategoryTitle = function(catnum) {
      return this.controllers[0].controller.getCategoryTitle(catnum);
    };

    MultiBox.evaluateConditions = function(device, devsubcat, conditions) {
      return this._execWithId(device, function(c, id) {
        return c.evaluateConditions(id, devsubcat, conditions);
      });
    };

    MultiBox.getWeatherSettings = function() {
      return this.controllers[0].controller.getWeatherSettings();
    };

    MultiBox.reloadEngine = function(controllerid) {
      var id;
      id = controllerid || 0;
      return this.controllers[id].controller.reloadEngine();
    };

    MultiBox.reboot = function(controllerid) {
      var id;
      id = controllerid || 0;
      return this.controllers[id].controller.reboot();
    };

    MultiBox.deleteScene = function(scene) {
      var elems, j, len, ref, watch;
      elems = scene.altuiid.split('-');
      ref = MultiBox.getWatches("VariablesToWatch", (function(w) {
        return elems[0] === 0 && w.sceneid === elems[1];
      }));
      for (j = 0, len = ref.length; j < len; j++) {
        watch = ref[j];
        MultiBox.delWatch(watch);
      }
      return this._execWithId(scene, function(c, id) {
        return c.deleteScene(id);
      });
    };

    MultiBox.getNewSceneID = function(controllerid) {
      var id, newid;
      id = controllerid || 0;
      newid = this.controllers[i].controller.getNewSceneID();
      return {
        id: newid,
        altuiid: controllerid + "-" + newid
      };
    };

    MultiBox.getScenes = function(func, filterfunc, endfunc) {
      var answers, arr, c, i, j, len, ref;
      arr = [];
      answers = 0;
      ref = this.controllers;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        c = ref[i];
        c.controller.getScene(func, filterFunc, function(scenes) {
          arr = arr.concat(scenes);
          answers++;
          if (answers === this.controllers.length && $.isFunction(endfunc)) {
            return endfunc(arr);
          }
        });
      }
      return arr;
    };

    MultiBox.getScenesSync = function() {
      return this._union(function(c) {
        return c.getScenesSync();
      });
    };

    MultiBox.getSceneByID = function(controllerid, sceneid) {
      if (this.controllers[controllerid] == null) {
        return null;
      } else {
        return this.controllers[controllerid].controller.getSceneByID(sceneid);
      }
    };

    MultiBox.getSceneByAltuiID = function(altuiid) {
      return this._execWithId(altuiid, function(c, id) {
        return c.getSceneByID(id);
      });
    };

    MultiBox.getSceneHistory = function(scene, cbfunc) {
      return this._execWithId(scene, function(c, id) {
        return c.getSceneHistory(id, cbfunc);
      });
    };

    MultiBox.editScene = function(altuiid, scenejson, cbfunc) {
      return this._execWithId(altuiid, function(c, id) {
        return c.editScene(id, scenejson, cbfunc);
      });
    };

    MultiBox.renameScene = function(scene, newname) {
      return this._execWithId(scene, function(c, id) {
        return c.renameScene(id, newname);
      });
    };

    MultiBox.runScene = function(scene) {
      return this._execWithId(scene, function(c, id) {
        return c.runScene(id);
      });
    };

    MultiBox.runSceneByAltuiID = function(altuiid) {
      return this.runScene(altuiid);
    };

    MultiBox.runLua = function(controllerid, code, cbfunc) {
      var id;
      id = controllerid || 0;
      return this.controllers[id].controller.runLua(code, cbfunc);
    };

    MultiBox.getLuaStartup = function(controllerid) {
      var id;
      id = controllerid || 0;
      return this.controllers[id].controller.getLuaStartup();
    };

    MultiBox.setStartupCode = function(controllerid, code) {
      var dfd, id;
      id = controllerid || 0;
      if (id === 0) {
        return this.controllers[id].controller.setStartupCode(code);
      } else {
        dfd = $.Deferred();
        dfd.reject();
        return dfd.promise();
      }
    };

    MultiBox.saveChangeCaches = function(controllerid, msgidx) {
      var id;
      id = controllerid || 0;
      return this.controllers[id].controller.saveChangeCaches(msgidx);
    };

    MultiBox.updateChangeCache = function(controllerid, target) {
      var id;
      id = controllerid || 0;
      return this.controllers[id].controller.saveChangeCaches(msgidx);
    };

    MultiBox.saveData = function(name, data, cbfunc) {
      return this.controllers[0].controller.saveData(name, data, cbfunc);
    };

    MultiBox.getPlugins = function(func, endfunc) {
      var arr;
      arr = this._union(function(c) {
        return c.getPlugins(func, null);
      });
      if ($.isFunction(endfunc)) {
        endfunc(arr);
      }
      return arr;
    };

    MultiBox.deletePlugin = function(altuiid, cbfunc) {
      return this._execWithId(altuiid, function(c, id) {
        return c.getUPnPHelper().UPnPDeletePlugin(id, cbfunc);
      });
    };

    MultiBox.updatePlugin = function(altuiid, cbfunc) {
      return this._execWitId(altuiid, function(c, id) {
        return c.getUPnPHelper().UPnPUpdatePlugin(id, cbfunc);
      });
    };

    MultiBox.updatePluginVersion = function(altuiid, ver, cbfunc) {
      return this._execWithId(aluiid, function(c, id) {
        return c.getUPnPHelper().UPnPUpdatePluginVersion(id, ver, cbfunc);
      });
    };

    MultiBox.getFileContent = function(controllerid, filename, cbfunc) {
      var id;
      id = controllerid || 0;
      return this.controllers[id].controller.getUPnPHelper().UPnPGetFile(filename, cbfunc);
    };

    MultiBox.osCommand = function(controllerid, cmd, cbfunc) {
      var id;
      id = controllerid || 0;
      return this.controllers[id].controller.osCommand(cmd, cbfunc);
    };

    MultiBox.getPower = function(cbfunc) {
      var c, idx, j, len, lines, ref, results, todo;
      lines = [];
      todo = this.controllers.length;
      ref = this.controllers;
      results = [];
      for (idx = j = 0, len = ref.length; j < len; idx = ++j) {
        c = ref[idx];
        results.push(c.controller.getPower(function(data) {
          var i, k, len1, line, ref1;
          if (data !== "No devices") {
            ref1 = data.split('\n');
            for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
              line = ref1[i];
              if (line.length > 0) {
                lines.push(idx + "-" + line);
              }
            }
          }
          todo--;
          if (todo === 0 && $.isFunction(cbfunc)) {
            return cbfunc(lines.join('\n'));
          }
        }));
      }
      return results;
    };

    MultiBox.resetPollCounters = function() {
      var c, dfd, i, j, len, ref, todo;
      dfd = $.Deferred();
      todo = this.controllers.length;
      ref = this.controllers;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        c = ref[i];
        c.controller.resetPollCounters(function() {
          todo--;
          if (todo === 0) {
            return dfd.resolve();
          }
        });
      }
      return dfd.promise();
    };

    MultiBox.isUserDataCaches = function(controllerid) {
      var id;
      id = controllerid || 0;
      return this.controllers[id].controller.isUserDataCached();
    };

    MultiBox.getIconPath = function(controllerid, iconname) {
      var id;
      id = controller || 0;
      return this.controllers[id].controller.getIconPath(iconname);
    };

    MultiBox.getIcon = function(controllerid, imgpath, cbfunc) {
      var id;
      id = controllerid || 0;
      return this.controllers[id].controller.getIcon(imgpath, cbfunc);
    };

    MultiBox.triggerAltUIUpgrade = function(urlsuffix, newrev) {
      return this.controllers[0].controller.triggerAltUIUpgrade(urlsuffix, newrev);
    };

    MultiBox.buildUPnPGetFileUrl = function(altuiid, name) {
      return this._exec(altuiid, function(c) {
        return c.getUPnPHelper().buildUPnPGetFileUrl(name);
      });
    };

    MultiBox.isRemoteAccess = function() {
      return window.location.href.indexOf("mios.com") !== -1;
    };

    MultiBox.getBoxInfo = function() {
      return this.controllers[0].controller.getBoxInfo();
    };

    MultiBox.getBoxFullInfo = function() {
      return this.controllers[0].controller.getBoxFullInfo();
    };

    MultiBox.getHouseMode = function(cb) {
      return this.controllers[0].controller.getHouseMode(cb);
    };

    MultiBox.setOnOff = function(altuiid, onoff) {
      return MultiBox.runActionByAltuiID(altuiid, 'urn:upnp-org:serviceId:SwitchPower1', 'SetTarget', {
        'newTargetValue': onoff
      });
    };

    MultiBox.setArm = function(altuiid, armed) {
      return this.runActionByAltuiID(altuiid, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'SetArmed', {
        'newArmedValue': armed
      });
    };

    MultiBox.setDoorLock = function(altuiid, armed) {
      return this.runActionByAltuiID(altuiid, 'urn:micasaverde-com:serviceId:DoorLock1', 'SetTarget', {
        'newTargerValue': armed
      });
    };

    return MultiBox;

  })();

}).call(this);
