
    function returnTrueValue () {
        for (let i = 0; i < arguments.length; i++) {
            const element = arguments[i];
            if (element) {
                return element
            }
        }
    }

exports.returnTrueValue = returnTrueValue
