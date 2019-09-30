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
            let errors = [];
            for (input in object) {
                const conditions = object[input];
                for (condition of conditions) {

                    if (condition === 'required') {
                        if (! input.length) {
                            errors.push(`The field ${'z'} is required`);
                        }
                    }
                    else if (condition.startsWith('min:')) {
                        const min = condition.split(':')[1];
                        if (input.length < min) {
                            errors.push(`The field ${'z'} is too short`)
                        }
                    }

                    else if (condition.startsWith('max:')) {
                        const max = condition.split(':')[1]
                        if (input.length > max) {
                            errors.push(`The field ${'z'} is too long`)
                        }
                    }
                }
            }

            return ! errors.length;
        }
    }
};


module.exports = Helpers;