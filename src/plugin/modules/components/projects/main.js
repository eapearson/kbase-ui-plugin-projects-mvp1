/*eslint {"strict": ["error", "global"]} */
'use strict';
define([
    'knockout',
    'marked',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_knockout/components/overlayPanel',
    'kb_lib/html',
    '../myProjects/main',
    '../newProject/main',
    '../../lib/model'
], function (
    ko,
    marked,
    reg,
    gen,
    OverlayPanelComponent,
    html,
    MyProjectsComponent,
    NewProjectComponent,
    {Model}
) {
    class ViewModel {
        constructor({runtime}) {
            this.runtime = runtime;

            this.view = ko.observable('myprojects');

            // overlay
            this.overlayComponent = ko.observable();
            // this.showOverlay = ko.observable();
            // this.subscribe(this.showOverlay, (newValue) => {
            //     this.overlayComponent(newValue);
            // });

            this.actions = {
                showOverlay: (component) => {
                    this.overlayComponent(component);
                },
                return: () => {
                    this.view('myprojects');
                },
                showNewProjectForm: () => {
                    this.view('newproject');
                }
            };
        }

        doCreateNewProject() {
            this.view('newproject');
        }

        doResetFakeData() {
            const model = new Model({runtime: this.runtime});
            model.recreateFakeData();
        }
    }

    // VIEW

    const t = html.tag,
        p = t('p'),
        h3 = t('h3'),
        h4 = t('h4'),
        div = t('div');

    const style = html.makeStyles({
        component: {
            css: {
                // margin: '10px',
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column'
            }
        },
        view: {
            css: {
                margin: '10px',
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column'
            }
        },
        row: {
            css: {
                margin: '0 10px',
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'row'
            }
        },
        col1: {
            css: {
                flex: '1 1 0px',
                margin: '0 5px'
            }
        },
        col2: {
            css: {
                flex: '2 1 0px',
                margin: '0 5px'
            }
        }
    });

    // function buildToolbar() {
    //     return div({
    //         class: 'btn-toolbar'
    //     }, [
    //         div({
    //             class: 'btn-group'
    //         }, [
    //             button({
    //                 class: 'btn btn-default',
    //                 dataBind: {
    //                     click: 'function (){$component.doCreateNewProject.call($component)}'
    //                 }
    //             }, [
    //                 'Create New Project'
    //             ])
    //         ])
    //     ]);
    // }

    function buildMyProjects() {
        return div({
            class: style.classes.row
        },[
            div({
                class: style.classes.col2
            }, [
                h3({
                    style: {
                        marginTop: '0px'
                    }
                }, 'Your Projects'),
                // buildToolbar(),
                div({
                    dataBind: {
                        component: {
                            name: MyProjectsComponent.quotedName(),
                            params: {
                                runtime: 'runtime',
                                showNewProjectForm: 'actions.showNewProjectForm'
                            }
                        }
                    }
                })
            ]),
            div({
                class: style.classes.col1
            }, [
                h4('Projects'),
                marked(`
Organize your work with Projects!

With projects you can organize your Narratives into collections.
From a Project, you can sort and search a convenient subset of your Narratives.

What are Projects useful for?
- Organize your favorite Narratives
- Support a work project with by collecting all relevant narratives together
- Show off your public narratives by creating a public folder with public narratives
                `)
            ])
        ]);
    }

    function buildNewProject() {
        return div({
            class: style.classes.view,
            dataBind: {
                component: {
                    name: NewProjectComponent.quotedName(),
                    params: {
                        runtime: 'runtime',
                        actions: 'actions'
                    }
                }
            }
        });
    }

    function template() {
        return div({
            class: style.classes.component
        }, [
            gen.switch('view', [
                [
                    '"myprojects"', buildMyProjects()
                ],
                [
                    '"newproject"', buildNewProject()
                ]
            ]),
            gen.component({
                name: OverlayPanelComponent.name(),
                params: {
                    component: 'overlayComponent'
                }
            })
        ]);
    }

    function component() {
        return {
            viewModel: ViewModel,
            template: template(),
            stylesheet: style.sheet
        };
    }

    return reg.registerComponent(component);
});