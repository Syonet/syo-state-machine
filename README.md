syoStatemachine
=================

Permite a criação de uma máquina de estados, com a adição de um conceito adicional: a herança.

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

$( "#statemchine" ).start();
$( "#statemchine" ).statemachine( "executeTransition", "transition1" );
$( "#statemchine" ).statemachine( "executeTransition", "transition1" );
```

### Documentação da API

#### Statemachine

* ```states``` - Array de states.

#### State

* ```id``` - Identificador único do state.
* ```inputActions``` - Array de functions que serão executadas ao entrar no state (Opcional).
* ```outputActions``` - Array de functions que serão executadas ao sair no state (Opcional).
* ```transitions``` - Array de transitions que partem do state (Opcional).
* ```inherits``` - Array de "super-states" (semelhante a super-classes) do state (Opcional).

#### Transition

* ```id``` - Identificador único da transition.
* ```toState``` - Identificador do state que será selecionado após a execução da transition.
