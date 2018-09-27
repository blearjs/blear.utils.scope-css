(function (__karma__, coolie) {
    var tests = [];

    for (var file in __karma__.files) {
        if (__karma__.files.hasOwnProperty(file)) {
            if (/\/test\.[^/]*\.js$/i.test(file)) {
                tests.push(file);
            }
        }
    }

    coolie.config({
        nodeModuleMainPath: 'src/index.js'
    });
    coolie.use(tests);

    coolie.callback(function () {
        __karma__.start.call();
    });

    var oldConsole = window.console;
    window.console = {
        log: function (log) {
            var p = document.createElement('p');
            p.style.background = '#cfefcf';
            p.style.color = '#158d1a';
            p.style.padding = '2px';
            p.style.margin = '0px';
            p.innerHTML = log;
            document.body.appendChild(p);
            oldConsole.log(log);
        },
        error: function (error) {
            var p = document.createElement('p');
            p.innerHTML = error;
            p.style.background = '#d43232';
            p.style.color = '#fff';
            p.style.padding = '2px';
            p.style.margin = '0px';
            document.body.appendChild(p);
            oldConsole.error(error);
        }
    };
})(window.__karma__, coolie);
