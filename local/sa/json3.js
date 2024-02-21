(function () {
  var objectTypes = {
    function: true,
    object: true,
  };
  var root = (objectTypes[typeof window] && window) || this;

  function runInContext(context, exports) {
    context || (context = root.Object());
    exports || (exports = root.Object());

    var Number = context.Number || root.Number,
      String = context.String || root.String,
      Object = context.Object || root.Object,
      Date = context.Date || root.Date,
      SyntaxError = context.SyntaxError || root.SyntaxError,
      TypeError = context.TypeError || root.TypeError,
      Math = context.Math || root.Math,
      nativeJSON = context.JSON || root.JSON;

    if (typeof nativeJSON == 'object' && nativeJSON) {
      exports.stringify = nativeJSON.stringify;
      exports.parse = nativeJSON.parse;
      exports.runInContext = runInContext;
      return exports;
    }

    var objectProto = Object.prototype,
      getClass = objectProto.toString,
      isProperty = objectProto.hasOwnProperty,
      undefined$1;

    function attempt(func, errorFunc) {
      try {
        func();
      } catch (exception) {
        if (errorFunc) {
          errorFunc();
        }
      }
    }

    var isExtended = new Date(-3509827334573292);
    attempt(function () {
      isExtended =
        isExtended.getUTCFullYear() == -109252 &&
        isExtended.getUTCMonth() === 0 &&
        isExtended.getUTCDate() === 1 &&
        isExtended.getUTCHours() == 10 &&
        isExtended.getUTCMinutes() == 37 &&
        isExtended.getUTCSeconds() == 6 &&
        isExtended.getUTCMilliseconds() == 708;
    });

    function has(name) {
      if (has[name] != null) {
        return has[name];
      }
      var isSupported;
      if (name == 'bug-string-char-index') {
        isSupported = 'a'[0] != 'a';
      } else if (name == 'json') {
        isSupported =
          has('json-stringify') &&
          has('date-serialization') &&
          has('json-parse');
      } else if (name == 'date-serialization') {
        isSupported = has('json-stringify') && isExtended;
        if (isSupported) {
          var stringify = exports.stringify;
          attempt(function () {
            isSupported =
              stringify(new Date(-8.64e15)) ==
                '"-271821-04-20T00:00:00.000Z"' &&
              stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
              stringify(new Date(-621987552e5)) ==
                '"-000001-01-01T00:00:00.000Z"' &&
              stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
          });
        }
      } else {
        var value,
          serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
        if (name == 'json-stringify') {
          var stringify = exports.stringify,
            stringifySupported = typeof stringify == 'function';
          if (stringifySupported) {
            (value = function () {
              return 1;
            }).toJSON = value;
            attempt(
              function () {
                stringifySupported =
                  stringify(0) === '0' &&
                  stringify(new Number()) === '0' &&
                  stringify(new String()) == '""' &&
                  stringify(getClass) === undefined$1 &&
                  stringify(undefined$1) === undefined$1 &&
                  stringify() === undefined$1 &&
                  stringify(value) === '1' &&
                  stringify([value]) == '[1]' &&
                  stringify([undefined$1]) == '[null]' &&
                  stringify(null) == 'null' &&
                  stringify([undefined$1, getClass, null]) ==
                    '[null,null,null]' &&
                  stringify({
                    a: [value, true, false, null, '\x00\b\n\f\r\t'],
                  }) == serialized &&
                  stringify(null, value) === '1' &&
                  stringify([1, 2], null, 1) == '[\n 1,\n 2\n]';
              },
              function () {
                stringifySupported = false;
              }
            );
          }
          isSupported = stringifySupported;
        }
        if (name == 'json-parse') {
          var parse = exports.parse,
            parseSupported;
          if (typeof parse == 'function') {
            attempt(
              function () {
                if (parse('0') === 0 && !parse(false)) {
                  value = parse(serialized);
                  parseSupported =
                    value['a'].length == 5 && value['a'][0] === 1;
                  if (parseSupported) {
                    attempt(function () {
                      parseSupported = !parse('"\t"');
                    });
                    if (parseSupported) {
                      attempt(function () {
                        parseSupported = parse('01') !== 1;
                      });
                    }
                    if (parseSupported) {
                      attempt(function () {
                        parseSupported = parse('1.') !== 1;
                      });
                    }
                  }
                }
              },
              function () {
                parseSupported = false;
              }
            );
          }
          isSupported = parseSupported;
        }
      }
      return (has[name] = !!isSupported);
    }
    has['bug-string-char-index'] =
      has['date-serialization'] =
      has['json'] =
      has['json-stringify'] =
      has['json-parse'] =
        null;

    if (!has('json')) {
      var functionClass = '[object Function]',
        dateClass = '[object Date]',
        numberClass = '[object Number]',
        stringClass = '[object String]',
        arrayClass = '[object Array]',
        booleanClass = '[object Boolean]';

      var charIndexBuggy = has('bug-string-char-index');

      var forOwn = function (object, callback) {
        var size = 0,
          Properties,
          dontEnums,
          property;

        (Properties = function () {
          this.valueOf = 0;
        }).prototype.valueOf = 0;

        dontEnums = new Properties();
        for (property in dontEnums) {
          if (isProperty.call(dontEnums, property)) {
            size++;
          }
        }
        Properties = dontEnums = null;

        if (!size) {
          dontEnums = [
            'valueOf',
            'toString',
            'toLocaleString',
            'propertyIsEnumerable',
            'isPrototypeOf',
            'hasOwnProperty',
            'constructor',
          ];
          forOwn = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass,
              property,
              length;
            var hasProperty =
              (!isFunction &&
                typeof object.constructor != 'function' &&
                objectTypes[typeof object.hasOwnProperty] &&
                object.hasOwnProperty) ||
              isProperty;
            for (property in object) {
              if (
                !(isFunction && property == 'prototype') &&
                hasProperty.call(object, property)
              ) {
                callback(property);
              }
            }
            for (
              length = dontEnums.length;
              (property = dontEnums[--length]);

            ) {
              if (hasProperty.call(object, property)) {
                callback(property);
              }
            }
          };
        } else {
          forOwn = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass,
              property,
              isConstructor;
            for (property in object) {
              if (
                !(isFunction && property == 'prototype') &&
                isProperty.call(object, property) &&
                !(isConstructor = property === 'constructor')
              ) {
                callback(property);
              }
            }
            if (
              isConstructor ||
              isProperty.call(object, (property = 'constructor'))
            ) {
              callback(property);
            }
          };
        }
        return forOwn(object, callback);
      };

      if (!has('json-stringify') && !has('date-serialization')) {
        var Escapes = {
          92: '\\\\',
          34: '\\"',
          8: '\\b',
          12: '\\f',
          10: '\\n',
          13: '\\r',
          9: '\\t',
        };

        var leadingZeroes = '000000';
        var toPaddedString = function (width, value) {
          return (leadingZeroes + (value || 0)).slice(-width);
        };

        var serializeDate = function (value) {
          var getData,
            year,
            month,
            date,
            time,
            hours,
            minutes,
            seconds,
            milliseconds;
          if (!isExtended) {
            var floor = Math.floor;
            var Months = [
              0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334,
            ];
            var getDay = function (year, month) {
              return (
                Months[month] +
                365 * (year - 1970) +
                floor((year - 1969 + (month = +(month > 1))) / 4) -
                floor((year - 1901 + month) / 100) +
                floor((year - 1601 + month) / 400)
              );
            };
            getData = function (value) {
              date = floor(value / 864e5);
              for (
                year = floor(date / 365.2425) + 1970 - 1;
                getDay(year + 1, 0) <= date;
                year++
              );
              for (
                month = floor((date - getDay(year, 0)) / 30.42);
                getDay(year, month + 1) <= date;
                month++
              );
              date = 1 + date - getDay(year, month);
              time = ((value % 864e5) + 864e5) % 864e5;
              hours = floor(time / 36e5) % 24;
              minutes = floor(time / 6e4) % 60;
              seconds = floor(time / 1e3) % 60;
              milliseconds = time % 1e3;
            };
          } else {
            getData = function (value) {
              year = value.getUTCFullYear();
              month = value.getUTCMonth();
              date = value.getUTCDate();
              hours = value.getUTCHours();
              minutes = value.getUTCMinutes();
              seconds = value.getUTCSeconds();
              milliseconds = value.getUTCMilliseconds();
            };
          }
          serializeDate = function (value) {
            if (value > -1 / 0 && value < 1 / 0) {
              getData(value);
              value =
                (year <= 0 || year >= 1e4
                  ? (year < 0 ? '-' : '+') +
                    toPaddedString(6, year < 0 ? -year : year)
                  : toPaddedString(4, year)) +
                '-' +
                toPaddedString(2, month + 1) +
                '-' +
                toPaddedString(2, date) +
                'T' +
                toPaddedString(2, hours) +
                ':' +
                toPaddedString(2, minutes) +
                ':' +
                toPaddedString(2, seconds) +
                '.' +
                toPaddedString(3, milliseconds) +
                'Z';
              year =
                month =
                date =
                hours =
                minutes =
                seconds =
                milliseconds =
                  null;
            } else {
              value = null;
            }
            return value;
          };
          return serializeDate(value);
        };

        if (has('json-stringify') && !has('date-serialization')) {
          function dateToJSON(key) {
            return serializeDate(this);
          }

          var nativeStringify = exports.stringify;
          exports.stringify = function (source, filter, width) {
            var nativeToJSON = Date.prototype.toJSON;
            Date.prototype.toJSON = dateToJSON;
            var result = nativeStringify(source, filter, width);
            Date.prototype.toJSON = nativeToJSON;
            return result;
          };
        } else {
          var unicodePrefix = '\\u00';
          var escapeChar = function (character) {
            var charCode = character.charCodeAt(0),
              escaped = Escapes[charCode];
            if (escaped) {
              return escaped;
            }
            return unicodePrefix + toPaddedString(2, charCode.toString(16));
          };
          var reEscape = /[\x00-\x1f\x22\x5c]/g;
          var quote = function (value) {
            reEscape.lastIndex = 0;
            return (
              '"' +
              (reEscape.test(value)
                ? value.replace(reEscape, escapeChar)
                : value) +
              '"'
            );
          };

          var serialize = function (
            property,
            object,
            callback,
            properties,
            whitespace,
            indentation,
            stack
          ) {
            var value,
              type,
              className,
              results,
              element,
              index,
              length,
              prefix,
              result;
            attempt(function () {
              value = object[property];
            });
            if (typeof value == 'object' && value) {
              if (
                value.getUTCFullYear &&
                getClass.call(value) == dateClass &&
                value.toJSON === Date.prototype.toJSON
              ) {
                value = serializeDate(value);
              } else if (typeof value.toJSON == 'function') {
                value = value.toJSON(property);
              }
            }
            if (callback) {
              value = callback.call(object, property, value);
            }
            if (value == undefined$1) {
              return value === undefined$1 ? value : 'null';
            }
            type = typeof value;
            if (type == 'object') {
              className = getClass.call(value);
            }
            switch (className || type) {
              case 'boolean':
              case booleanClass:
                return '' + value;
              case 'number':
              case numberClass:
                return value > -1 / 0 && value < 1 / 0 ? '' + value : 'null';
              case 'string':
              case stringClass:
                return quote('' + value);
            }
            if (typeof value == 'object') {
              for (length = stack.length; length--; ) {
                if (stack[length] === value) {
                  throw TypeError();
                }
              }
              stack.push(value);
              results = [];
              prefix = indentation;
              indentation += whitespace;
              if (className == arrayClass) {
                for (
                  index = 0, length = value.length;
                  index < length;
                  index++
                ) {
                  element = serialize(
                    index,
                    value,
                    callback,
                    properties,
                    whitespace,
                    indentation,
                    stack
                  );
                  results.push(element === undefined$1 ? 'null' : element);
                }
                result = results.length
                  ? whitespace
                    ? '[\n' +
                      indentation +
                      results.join(',\n' + indentation) +
                      '\n' +
                      prefix +
                      ']'
                    : '[' + results.join(',') + ']'
                  : '[]';
              } else {
                forOwn(properties || value, function (property) {
                  var element = serialize(
                    property,
                    value,
                    callback,
                    properties,
                    whitespace,
                    indentation,
                    stack
                  );
                  if (element !== undefined$1) {
                    results.push(
                      quote(property) + ':' + (whitespace ? ' ' : '') + element
                    );
                  }
                });
                result = results.length
                  ? whitespace
                    ? '{\n' +
                      indentation +
                      results.join(',\n' + indentation) +
                      '\n' +
                      prefix +
                      '}'
                    : '{' + results.join(',') + '}'
                  : '{}';
              }
              stack.pop();
              return result;
            }
          };

          exports.stringify = function (source, filter, width) {
            var whitespace, callback, properties, className;
            if (objectTypes[typeof filter] && filter) {
              className = getClass.call(filter);
              if (className == functionClass) {
                callback = filter;
              } else if (className == arrayClass) {
                properties = {};
                for (
                  var index = 0, length = filter.length, value;
                  index < length;

                ) {
                  value = filter[index++];
                  className = getClass.call(value);
                  if (
                    className == '[object String]' ||
                    className == '[object Number]'
                  ) {
                    properties[value] = 1;
                  }
                }
              }
            }
            if (width) {
              className = getClass.call(width);
              if (className == numberClass) {
                if ((width -= width % 1) > 0) {
                  if (width > 10) {
                    width = 10;
                  }
                  for (whitespace = ''; whitespace.length < width; ) {
                    whitespace += ' ';
                  }
                }
              } else if (className == stringClass) {
                whitespace = width.length <= 10 ? width : width.slice(0, 10);
              }
            }
            return serialize(
              '',
              ((value = {}), (value[''] = source), value),
              callback,
              properties,
              whitespace,
              '',
              []
            );
          };
        }
      }

      if (!has('json-parse')) {
        var fromCharCode = String.fromCharCode;

        var Unescapes = {
          92: '\\',
          34: '"',
          47: '/',
          98: '\b',
          116: '\t',
          110: '\n',
          102: '\f',
          114: '\r',
        };

        var Index, Source;

        var abort = function () {
          Index = Source = null;
          throw SyntaxError();
        };

        var lex = function () {
          var source = Source,
            length = source.length,
            value,
            begin,
            position,
            isSigned,
            charCode;
          while (Index < length) {
            charCode = source.charCodeAt(Index);
            switch (charCode) {
              case 9:
              case 10:
              case 13:
              case 32:
                Index++;
                break;
              case 123:
              case 125:
              case 91:
              case 93:
              case 58:
              case 44:
                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                Index++;
                return value;
              case 34:
                for (value = '@', Index++; Index < length; ) {
                  charCode = source.charCodeAt(Index);
                  if (charCode < 32) {
                    abort();
                  } else if (charCode == 92) {
                    charCode = source.charCodeAt(++Index);
                    switch (charCode) {
                      case 92:
                      case 34:
                      case 47:
                      case 98:
                      case 116:
                      case 110:
                      case 102:
                      case 114:
                        value += Unescapes[charCode];
                        Index++;
                        break;
                      case 117:
                        begin = ++Index;
                        for (position = Index + 4; Index < position; Index++) {
                          charCode = source.charCodeAt(Index);
                          if (
                            !(
                              (charCode >= 48 && charCode <= 57) ||
                              (charCode >= 97 && charCode <= 102) ||
                              (charCode >= 65 && charCode <= 70)
                            )
                          ) {
                            abort();
                          }
                        }
                        value += fromCharCode(
                          '0x' + source.slice(begin, Index)
                        );
                        break;
                      default:
                        abort();
                    }
                  } else {
                    if (charCode == 34) {
                      break;
                    }
                    charCode = source.charCodeAt(Index);
                    begin = Index;
                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
                      charCode = source.charCodeAt(++Index);
                    }
                    value += source.slice(begin, Index);
                  }
                }
                if (source.charCodeAt(Index) == 34) {
                  Index++;
                  return value;
                }
                abort();
              default:
                begin = Index;
                if (charCode == 45) {
                  isSigned = true;
                  charCode = source.charCodeAt(++Index);
                }
                if (charCode >= 48 && charCode <= 57) {
                  if (
                    charCode == 48 &&
                    ((charCode = source.charCodeAt(Index + 1)),
                    charCode >= 48 && charCode <= 57)
                  ) {
                    abort();
                  }
                  isSigned = false;
                  for (
                    ;
                    Index < length &&
                    ((charCode = source.charCodeAt(Index)),
                    charCode >= 48 && charCode <= 57);
                    Index++
                  );
                  if (source.charCodeAt(Index) == 46) {
                    position = ++Index;
                    for (; position < length; position++) {
                      charCode = source.charCodeAt(position);
                      if (charCode < 48 || charCode > 57) {
                        break;
                      }
                    }
                    if (position == Index) {
                      abort();
                    }
                    Index = position;
                  }
                  charCode = source.charCodeAt(Index);
                  if (charCode == 101 || charCode == 69) {
                    charCode = source.charCodeAt(++Index);
                    if (charCode == 43 || charCode == 45) {
                      Index++;
                    }
                    for (position = Index; position < length; position++) {
                      charCode = source.charCodeAt(position);
                      if (charCode < 48 || charCode > 57) {
                        break;
                      }
                    }
                    if (position == Index) {
                      abort();
                    }
                    Index = position;
                  }
                  return +source.slice(begin, Index);
                }
                if (isSigned) {
                  abort();
                }
                var temp = source.slice(Index, Index + 4);
                if (temp == 'true') {
                  Index += 4;
                  return true;
                } else if (
                  temp == 'fals' &&
                  source.charCodeAt(Index + 4) == 101
                ) {
                  Index += 5;
                  return false;
                } else if (temp == 'null') {
                  Index += 4;
                  return null;
                }
                abort();
            }
          }
          return '$';
        };

        var get = function (value) {
          var results, hasMembers;
          if (value == '$') {
            abort();
          }
          if (typeof value == 'string') {
            if ((charIndexBuggy ? value.charAt(0) : value[0]) == '@') {
              return value.slice(1);
            }
            if (value == '[') {
              results = [];
              for (;;) {
                value = lex();
                if (value == ']') {
                  break;
                }
                if (hasMembers) {
                  if (value == ',') {
                    value = lex();
                    if (value == ']') {
                      abort();
                    }
                  } else {
                    abort();
                  }
                } else {
                  hasMembers = true;
                }
                if (value == ',') {
                  abort();
                }
                results.push(get(value));
              }
              return results;
            } else if (value == '{') {
              results = {};
              for (;;) {
                value = lex();
                if (value == '}') {
                  break;
                }
                if (hasMembers) {
                  if (value == ',') {
                    value = lex();
                    if (value == '}') {
                      abort();
                    }
                  } else {
                    abort();
                  }
                } else {
                  hasMembers = true;
                }
                if (
                  value == ',' ||
                  typeof value != 'string' ||
                  (charIndexBuggy ? value.charAt(0) : value[0]) != '@' ||
                  lex() != ':'
                ) {
                  abort();
                }
                results[value.slice(1)] = get(lex());
              }
              return results;
            }
            abort();
          }
          return value;
        };

        var update = function (source, property, callback) {
          var element = walk(source, property, callback);
          if (element === undefined$1) {
            delete source[property];
          } else {
            source[property] = element;
          }
        };

        var walk = function (source, property, callback) {
          var value = source[property],
            length;
          if (typeof value == 'object' && value) {
            if (getClass.call(value) == arrayClass) {
              for (length = value.length; length--; ) {
                update(getClass, forOwn, value, length, callback);
              }
            } else {
              forOwn(value, function (property) {
                update(value, property, callback);
              });
            }
          }
          return callback.call(source, property, value);
        };

        exports.parse = function (source, callback) {
          var result, value;
          Index = 0;
          Source = '' + source;
          result = get(lex());
          if (lex() != '$') {
            abort();
          }
          Index = Source = null;
          return callback && getClass.call(callback) == functionClass
            ? walk(((value = {}), (value[''] = result), value), '', callback)
            : result;
        };
      }
    }

    exports.runInContext = runInContext;
    return exports;
  }

  var nativeJSON = root.JSON,
    previousJSON = root.JSON3,
    isRestored = false;

  var JSON3 = runInContext(
    root,
    (root.JSON3 = {
      noConflict: function () {
        if (!isRestored) {
          isRestored = true;
          root.JSON = nativeJSON;
          root.JSON3 = previousJSON;
          nativeJSON = previousJSON = null;
        }
        return JSON3;
      },
    })
  );

  root.JSON = {
    parse: JSON3.parse,
    stringify: JSON3.stringify,
  };
}.call(window));
