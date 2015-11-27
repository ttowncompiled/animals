var Util = (function () {
    function Util() {
    }
    Util.enumerate = function (value) {
        if (value < 10) {
            return "0" + value;
        }
        return "" + value;
    };
    return Util;
})();
exports.Util = Util;
//# sourceMappingURL=util.js.map