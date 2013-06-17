
(function( $ ) {

	module( "criação" );
	
	test( "Estrutura completa", function() {
		expect( 1 );
		
		$( "#statemachine" ).statemachine({
			start: [
				"stateA",
				"stateB"
			],
			states: [
				{
					id: "stateA",
					inputActions: [ function() {} ],
					outputActions: [ function() {} ],
					transitions: [{
						id: "transition1",
						toState: "stateB"
					}]
				},
				{
					id: "stateB",
					inputActions: [ function() {} ],
					outputActions: [ function() {} ],
					transitions: [{
						id: "transition2",
						toState: "stateA"
					}]
				}
			]
		});
		
		ok( true, "Estrutura criada corretamente" );
	});

	module( "inicialização" );
	
	test( "Iniciar com um estado definido como inicial", function() {
		expect( 1 );
		
		$( "#statemachine" ).statemachine({
			start: "stateA",
			states: [{
				id: "stateA"
			}]
		});
		
		$( "#statemachine" ).statemachine( "start" );
		strictEqual( $( "#statemachine" ).statemachine( "currentState" ).id, "stateA", "Iniciada corretamente" );
	});
		
	test( "Iniciar com mais de um estado definido como inicial", function() {
		expect( 1 );
		
		$( "#statemachine" ).statemachine({
			start: [
				"stateA",
				"stateB"
			],
			states: [{
				id: "stateA"
			},{
				id: "stateB"
			}]
		});
		
		$( "#statemachine" ).statemachine( "start", "stateB" );
		strictEqual( $( "#statemachine" ).statemachine( "currentState" ).id, "stateB", "Iniciada corretamente" );
	});
		
	test( "Não deve iniciar por estado não definido como inicial", function() {
		expect( 1 );
		
		$( "#statemachine" ).statemachine({
			start: [
				"stateA",
				"stateB"
			],
			states: [{
				id: "stateA"
			}, {
				id: "stateB"
			}, {
				id: "stateC"
			}]
		});
		
		try {
			$( "#statemachine" ).statemachine( "start", "stateC" );
			ok( false, "Inicializou" );
			
		} catch ( error ) {
			ok( true, "Não inicializou" );
		}
	});
	
	module( "execução" );
	
	test( "Execução básica", function() {
		expect( 3 );
		
		$( "#statemachine" ).statemachine({
			start: "stateA",
			states: [{
				id: "stateA",
				transitions: [{
					id: "transition1",
					toState: "stateB"
				}]
			}, {
				id: "stateB",
				transitions: [{
					id: "transition2",
					toState: "stateC"
				}]
			}, {
				id: "stateC",
				transitions: [{
					id: "transition3",
					toState: "stateA"
				}]
			}]
		});
		
		$( "#statemachine" ).statemachine( "start" );
		
		$( "#statemachine" ).statemachine( "executeTransition", "transition1" );
		strictEqual( $( "#statemachine" ).statemachine( "currentState" ).id, "stateB", "Foi para o estado B" );
		
		$( "#statemachine" ).statemachine( "executeTransition", "transition2" );
		strictEqual( $( "#statemachine" ).statemachine( "currentState" ).id, "stateC", "Foi para o estado C" );
		
		$( "#statemachine" ).statemachine( "executeTransition", "transition3" );
		strictEqual( $( "#statemachine" ).statemachine( "currentState" ).id, "stateA", "Foi para o estado A" );
	});
	
	test( "Execução de todas as ações de entrada", function() {
		expect( 1 );
		var count = 0;
		
		$( "#statemachine" ).statemachine({
			start: "stateA",
			states: [{
				id: "stateA",
				inputActions: [function() {
					count += 1;
				}, function() {
					count += 1;
				}]
			}]
		});
		
		$( "#statemachine" ).statemachine( "start" );
		strictEqual( count, 2, "Executou todas as ações" );
	});
	
	test( "Execução de todas as ações de saída", function() {
		expect( 1 );
		var count = 0;
		
		$( "#statemachine" ).statemachine({
			start: "stateA",
			states: [{
				id: "stateA",
				outputActions: [function() {
					count += 1;
				}, function() {
					count += 1;
				}],
				transitions: [{
					id: "transition1",
					toState: "stateB"
				}]
			}, {
				id: "stateB"
			}]
		});
		
		$( "#statemachine" ).statemachine( "start" );
		$( "#statemachine" ).statemachine( "executeTransition", "transition1" );
		strictEqual( count, 2, "Executou todas as ações" );
	});
	
	module( "herança" );
	
	test( "Deve executar uma transição em um super-estado", function() {
		expect( 1 );
		
		$( "#statemachine" ).statemachine({
			start: "stateC",
			states: [{
				id: "stateA",
				transitions: [{
					id: "transition1",
					toState: "stateD"
				}]
			}, {
				id: "stateB",
				inherits: [ "stateA" ]
			}, {
				id: "stateC",
				inherits: [ "stateB" ]
			}, {
				id: "stateD"
			}]
		});
		
		$( "#statemachine" ).statemachine( "start" );

		// Foi executada uma transição do estado A
		$( "#statemachine" ).statemachine( "executeTransition", "transition1" );
		
		strictEqual( $( "#statemachine" ).statemachine( "currentState" ).id, "stateD", "Executou a transição" );
	});
	
	test( "Deve executar uma transição entre estados relacionados por herança", function() {
		expect( 1 );
		var count = 0;
		
		$( "#statemachine" ).statemachine({
			start: "stateA",
			states: [{
				id: "stateA",
				transitions: [{
					id: "transition1",
					toState: "stateB"
				}],
				inputActions: [function() {
					count += 1;
				}],
				outputActions: [function() {
					count -= 1;
				}]
			}, {
				id: "stateB",
				inherits: [ "stateA" ],
				transitions: [{
					id: "transition2",
					toState: "stateA"
				}],
				inputActions: [function() {
					count += 1;
				}],
				outputActions: [function() {
					count -= 1;
				}]
			}]
		});
		
		$( "#statemachine" ).statemachine( "start" );
		$( "#statemachine" ).statemachine( "executeTransition", "transition1" );
		$( "#statemachine" ).statemachine( "executeTransition", "transition2" );
		
		strictEqual( count, 1, "Executou corretamente as ações" );
	});

}( jQuery ));