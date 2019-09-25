const Helpers = {
    Array : {
        chunk(array, size) {
            return array.slice(0,(array.length + size - 1) / size | 0).
            map((c, i) => {
                return array.slice(size * i, size * i + size) 
            })
        }
    },
    String: {
        slug(string) {
            return string.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
        }
    },
    Validation: {
        validate(object) {
            for (input in object) {
                console.log(input)
            }
        }
    }
}

module.exports = Helpers;