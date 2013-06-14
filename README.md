syoStatemachine
=================

Permite a criação de uma máquina de estados, com a adição de um conceito adicional: a herança.

Este plugin foi implementado utilizando o [Widget Factory do jQuery-UI](http://jqueryui.com/widget/).

O diagrama conceitual abaixo descreve a estrutura da máquina de estados:
![Diagrama de classes conceitual](./docs/SyoStatemachine.png)


Abaixo segue exemplo de uso:
```javascript
$( "#statemachine" ).statemachine({
    start: "stateA",
    states: [
        {
            id: "stateA",
            inputActions: [function() {
                alert( "A.in" );
            }],
            outputActions: [function() {
                alert( "A.out" );
            }],
            transitions: [{
                id: "transition1",
                toState: "stateB"
            }]
        },
        {
            id: "stateB",
            inputActions: [function() {
                alert( "B.in" );
            }],
            outputActions: [function() {
                alert( "B.out" );
            }],
            transitions: [{
                id: "transition2",
                toState: "stateA"
            }]
        }
    ]
});

$( "#statemchine" ).statemachine( "start" );
$( "#statemchine" ).statemachine( "executeTransition", "transition1" );
$( "#statemchine" ).statemachine( "executeTransition", "transition2" );
```

### Documentação da API

#### Options

**Statemachine**

- ```start``` - (String | Array) id ou lista de ids dos states iniciais.
- ```states``` - Array de states.

**State**

- ```id``` - Identificador único do state.
- ```inputActions``` - Array de functions que serão executadas ao entrar no state (Opcional).
- ```outputActions``` - Array de functions que serão executadas ao sair no state (Opcional).
- ```transitions``` - Array de transitions que partem do state (Opcional).
- ```inherits``` - Array de "super-states" (semelhante a super-classes) do state (Opcional).

**Transition**

- ```id``` - Identificador único da transition.
- ```toState``` - Identificador do state que será selecionado após a execução da transition.

#### Methods

Todas as funções devem ser chamadas no padrão: ```$( "selector" ).statemachine( "functionName", ...params )```.
Mais informações consultar documentação do [jquery-ui-widget](http://jqueryui.com/widget/).

- ```start()``` - Inicia a statemachine quando possui apenas um state inicial.
- ```start( stateId )``` - Inicia a statemachine quando possui mais de um state inicial.
- ```executeTransition( transitionId )``` - Executa uma transition do state atual.
- ```currentState()``` - Retorna o state atual.
