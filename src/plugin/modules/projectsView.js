define([
    'knockout',
    'kb_knockout/lib/generators',
    'kb_lib/html',
    './components/projects/main'
], function (
    ko,
    gen,
    html,
    MainComponent
) {
    'use strict';
    const t = html.tag,
        div = t('div');

    class Panel {
        constructor(params) {
            this.runtime = params.runtime;
            this.hostNode = null;
            this.container = null;
        }

        // VIEW
        render() {
            return gen.component2({
                name: MainComponent.quotedName(),
                params: {
                    runtime: 'runtime'
                }
            }).join('');
        }

        // API

        attach(node) {
            this.hostNode = node;
            this.container = node.appendChild(document.createElement('div'));
            this.container.style.flex = '1 1 0px';
            this.container.style.display = 'flex';
            this.container.style.flexDirection = 'column';
        }

        start() {
            this.container.innerHTML = this.render();
            this.runtime.send('ui', 'setTitle', 'Projects');
            ko.applyBindings({runtime: this.runtime}, this.container);
        }

        stop() {

        }

        detach() {

        }
    }

    return Panel;
});