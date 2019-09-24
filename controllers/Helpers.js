const Helpers = {
    Array : {
        chunk(array, size) {
            Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
                array.slice(i * size, i * size + size)
            );
        }
    },
    String: {
        slug(string) {
            return string.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
        }
    }
}