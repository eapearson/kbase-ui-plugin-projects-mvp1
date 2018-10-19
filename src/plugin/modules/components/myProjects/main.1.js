/*eslint {"strict": ["error", "global"]} */
'use strict';
define([
    'knockout',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_lib/html',
    'kb_lib/htmlBuilders',
    '../../lib/model',
    '../table/main',
    '../table/types',
    '../fields/projectLink',
    '../fields/userLink'
], function (
    ko,
    reg,
    gen,
    html,
    build,
    {Model},
    TableComponent,
    {Table, Column, Row},
    ProjectLinkComponent,
    UserLinkComponent
) {
    class ViewModel {
        constructor({runtime, showNewProjectForm}) {
            this.runtime = runtime;
            this.model = new Model({runtime});

            this.showNewProjectForm = showNewProjectForm;

            this.projects = ko.observableArray();

            this.projectsTable = new Table({
                terms: {
                    rowSynonym: ['project', 'projects']
                },
                sort: {
                    column: 'name',
                    direction: 'desc'
                },
                columns: [
                    new Column({
                        name: 'name',
                        label: 'Name',
                        width: 1,
                        sort: true,
                        component: ProjectLinkComponent.name()
                    }),
                    // new Column({
                    //     name: 'owner',
                    //     label: 'Owner',
                    //     width: 1,
                    //     sort: true,
                    //     component: UserLinkComponent.name()
                    // }),
                    new Column({
                        name: 'created',
                        label: 'Created',
                        type: 'date',
                        format: 'MMM DD, YYYY',
                        width: 1,
                        sort: true
                    }),
                    new Column({
                        name: 'lastUpdated',
                        label: 'Last updated',
                        type: 'date',
                        format: 'MMM DD, YYYY',
                        width: 1,
                        sort: true
                    })
                ]
            });

            this.messages = {
                none: 'no active search',
                notfound: 'sorry, not found',
                loading: 'loading...',
                error: 'error!'
            };


            this.ready = ko.observable(false);

            this.loadProjects();
        }

        loadProjects() {
            this.ready(false);
            this.model.getMyProjects()
                .then((projects) => {
                    this.projectsTable.clear();
                    projects.forEach((project) => {
                    // project.link = {
                    //     id: project.id,
                    //     slug: project.slug,
                    //     name: project.name
                    // },
                        this.projectsTable.addRow(new Row({
                            data: project
                        }));
                    });

                    this.ready(true);
                });
        }

        doResetFakeData() {
            const model = new Model({runtime: this.runtime});
            model.recreateFakeData();
            this.loadProjects();
        }

        doShowNewProjectForm() {
            this.showNewProjectForm();
        }
    }

    // VIEW

    const t = html.tag,
        button = t('button'),
        span = t('span'),
        div = t('div');

    function buildProject() {
        return div([
            div([
                'id: '
                , span({
                    dataBind: {
                        text: 'id'
                    }
                })]),
            div([
                'name: ', span({
                    dataBind: {
                        text: 'name'
                    }
                })]),
            div([
                'owner: ', span({
                    dataBind: {
                        text: 'owner'
                    }
                })])
        ]);
    }

    function buildProjectsList() {
        return gen.foreach('projects',
            buildProject());
    }

    function buildToolbar() {
        return div({
            class: 'btn-toolbar'
        }, [
            div({
                class: 'btn-group'
            }, [
                button({
                    class: 'btn btn-default',
                    dataBind: {
                        click: 'function (){$component.doShowNewProjectForm.call($component)}'
                    }
                }, [
                    'Create New Project'
                ]),
                button({
                    class: 'btn btn-default',
                    dataBind: {
                        click: 'function (){$component.doResetFakeData.call($component)}'
                    }
                }, [
                    'Reset Projects DB and Recreate Fake Data'
                ])
            ])
        ]);
    }

    function buildProjectsTable() {
        return div({
            dataBind: {
                component: {
                    name: TableComponent.quotedName(),
                    params: {
                        table: 'projectsTable',
                        messages: 'messages'
                    }
                }
            }
        });
    }

    function buildProjects() {
        return [
            buildToolbar(),
            buildProjectsTable()
        ];
    }

    function buildWaiting() {
        return build.loading('Loading projects');
    }

    function template() {
        return div([
            gen.if('ready',
                buildProjects(),
                buildWaiting())
        ]);
    }

    function component() {
        return {
            viewModel: ViewModel,
            template: template()
        };
    }

    return reg.registerComponent(component);
});