import React, { Component } from 'react';
class inputCustomizado extends Component {
        render(){
            return(
                <div className="pure-control-group">
                <label htmlFor="nome">Nome</label>
                <input id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome}/>
                </div>

            );

        }


}
                 