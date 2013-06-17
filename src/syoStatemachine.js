
(function( $ ) {

	$.widget( "syonet.statemachine", {
		options: {},
		
		_currentState: null,
		
		_create: function() {
			this._validateStructure();
		},
		
		_validateStructure: function() {
			var state,
				transition,
				inputAction,
				outputAction;
			
			// Valida a máquina de estados
			if ( !this.options.start ) {
				throw new Error( "Você indicou nenhum estado inicial!" );
			}
			
			if ( $.isArray( this.options.start ) && !this.options.start.length ) {
				throw new Error( "Você indicou nenhum estado inicial!" );
			}
			
			if ( !this.options.states || !this.options.states.length ) {
				throw new Error( "Você passou nenhum estado!" );
			}
			
			// Valida os estados
			for ( var i = 0; i < this.options.states.length; i++ ) {
				state = this.options.states[ i ];
				
				if ( !state.id ) {
					throw new Error( "Os estados devem ter id!" );
				}
				
				// Valida as transições
				if ( state.transitions ) {
					for ( var j = 0; j < state.transitions.length; j++ ) {
						if ( state.transitions[ j ] ) {
							if ( !state.transitions[ j ].id ) {
								throw new Error( "As transições devem ter id!" );
							}
							
							if ( !state.transitions[ j ].toState ) {
								throw new Error( "As transições devem ter um estado destino!" );
							}
						}
					}
				}
				
				// Valida as ações de entrada
				if ( state.inputActions ) {
					for ( var j = 0; j < state.inputActions.length; j++ ) {
						if ( !$.isFunction( state.inputActions[ j ] ) ) {
							throw new Error( "As inputActions devem ser funções!" );
						}
					}
				}
				
				// Valida as ações de sa�da
				if ( state.outputActions ) {
					for ( var i = 0; i < state.outputActions.length; i++ ) {
						if ( !$.isFunction( state.outputActions[ i ] ) ) {
							throw new Error( "As outputActions devem ser funções!" );
						}
					}
				}
			}
		},
		
		start: function( stateId ) {
			var state;
			
			if ( $.isArray( this.options.start ) && this.options.start.length ) {
				// Se foi passado mais de um estado inicial
				if ( !found( this.options.start, stateId ) ) {
					throw new Error( "O estado '" + stateId + "' não está definido como inicial!" );
				}
				
			} else {
				// Se foi passado apenas um estado inicial
				stateId = this.options.start;
			}
			
			state = find( this.options.states, stateId );
			this._currentState = state;
			
			if ( state.inputActions ) {
				for ( var i = 0; i < state.inputActions.length; i++ ) {
					state.inputActions[ i ].apply( this );
				}
			}
		},
		
		executeTransition: function( transitionId ) {
			var state = this._getStateOfTransition( this._currentState, transitionId );
			var toState;
			var transition;
			
			if ( !state ) {
				throw new Error( "O estado '" + state.id + "' não possui a transição '" + transitionId + "'!" );
			}
			
			transition = find( state.transitions, transitionId );
			toState = find( this.options.states, transition.toState );
			
			// Se o state destino não herda de origem
			if ( !found( toState.inherits, state.id ) ) {
				if ( this._currentState.outputActions ) {
					for ( var i = 0; i < this._currentState.outputActions.length; i++ ) {
						this._currentState.outputActions[ i ].apply( this );
					}
				}
			}
			
			this._currentState = toState;
			
			// Se o state origem não herda do destino 
			if ( !found( state.inherits, toState.id ) ) {
				if ( toState.inputActions ) {
					for ( var i = 0; i < toState.inputActions.length; i++ ) {
						toState.inputActions[ i ].apply( this );
					}
				}
			}
		},
		
		currentState: function() {
			return this._currentState;
		},
		
		/**
		 * Procura pelo estado que possui a transição "transitionId" a
		 * partir do estado "state". A pesquisa vai sendo feita de forma
		 * recursiva para conseguir pesquisar nos super-estados.
		 */
		_getStateOfTransition: function( state, transitionId ) {
			var transition = find( state.transitions, transitionId );
			var superState,
				auxState;
			
			if ( transition ) {
				return state;
			}
			
			// Verifica se o estado atual herda de algum(ns) outro(s) estado(s)
			if ( $.isArray( state.inherits )) {
				for ( var i = 0; i < state.inherits.length; i++ ) {
					superState = find( this.options.states, state.inherits[ i ] );
					return this._getStateOfTransition( superState, transitionId );
				}
			}
			
			return null;
		}
	});
	
	/**
	 * Procura um item em uma lista, comparando pelo id.
	 * Retorna o item encontrado ou null, caso não encontre.
	 */
	function find( list, id ) {
		if ( list ) {
			for ( var i = 0; i < list.length; i++ ) {
				if ( list[ i ].id === id ) {
					return list[ i ];
				}
			}
		}
		
		return null;
	}
	
	/**
	 * Procura um item em um array.
	 * Se encontrar retorna true, senão false.
	 */
	function found( list, item ) {
		if ( list ) {
			return ( list.indexOf( item ) != -1 );
		}
		
		return false;
	}

}( jQuery ));