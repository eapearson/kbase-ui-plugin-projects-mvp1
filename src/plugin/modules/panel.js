define([
    'knockout',
    'kb_lib/html',
    './components/main'
], function (
    ko,
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
            return div({
                dataBind: {
                    component: {
                        name: MainComponent.quotedName(),
                        params: {
                            runtime: 'runtime'
                        }
                    }
                }
            });
        }

        // API

        attach(node) {
            this.hostNode = node;
            this.container = node.appendChild(document.createElement('div'));
        }

        start() {
            this.container.innerHTML = this.render();
            ko.applyBindings({runtime: this.runtime}, this.container);
        }

        stop() {

        }

        detach() {

        }
    }

    return Panel;
});