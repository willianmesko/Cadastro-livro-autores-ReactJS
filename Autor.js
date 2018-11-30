import React, { Component } from 'react';
import $ from 'jquery';
import inputCustomizado from './componentes/inputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from 'TratadorErros';

export default class FormularioAutor extends Component {
    construct(){
        super();
        this.state = {nome:'',email:'', senha:''};
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
          url:"htttp://localhost:8080/api/autores",
          contentType:'application/json',
          dataType:'JSON',
          type:'POST',
          data:JSON.stringify({nome:'this.state.nome',email:'this.state.email',senha:'this.state.senha'}),
          success:function(NovaListagem) {
            Pubsub.publish('atualiza-lista-autores',NovaListagem);
            this.setState({nome:'',email:'',senha:''});
          }.bind(this),
          error:function(resposta){
            if(resposta.status === 400) {
                new TratadorErros().publicaErros(resposta.responseJSON);

            }
    
          },
          beforeSend: function(){
              PubSub.publish("limpa-erros",{});
          }
        });
    
        
      }
        setNome(evento) {
          this.setState({nome:evento.target.value});
        }
        setEmail(evento) {
          this.setState({email:evento.target.value});
        }
        setSenha(evento){
          this.setState({senha:evento.target.value});
        }


    render(){
        return(
            <div className="pure-form pure-form-aligned" onSubmit={enviaForm} method={post}>
                <form className="pure-form pure-form-aligned">
                    <inputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome}  label="Nome" />
                    <inputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email"/>
                    <inputCustomizado  id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha"/>
            
            <div className="pure-control-group">
                <label></label>
             <button type="submit" className="pure-button pure-button-primary">Gravar</button>
            </div>
            </form>      
            </div>



        );
    }


}

export default class ListaAutor extends Component {
    
      


    render(){
        return(

            <div>
                  <table className="pure-table">
                  <thead>
                  <tr>
                  <th>Nome</th>
                  <th>email</th>
                  </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.lista.map(function(autor){
                        return (
                          <tr key={autor.id}>
                            <td>{autor.nome} </td>
                            <td> {autor.email} </td>
                          </tr>
                          );

                      })

                    }
                  </tbody>
                  </table>
                  </div>

        );

    }


}

export default class AutorBox extends Component {
    construct(){
        super();
        this.state = {lista: []};


    }

    componentDidMount() {
        $.ajax({
          url:"http://localhost:8080/api/autores",
          dataType:'json',
          sucess:function(resposta){
            this.setState = {lista:resposta};
          }.bind(this)
    
        });

        PubSub.subscribe('atualiza-lista-autores',function(topico,Novalista){
            this.setState({lista:Novalista});

        }).bind(this);
        
      }
      

      

    render(){
        return(
      
         <div> 
                  <div className="header">
              
                    <h2>Formulario de autores</h2>
                    </div>
                    <div className="content" id="content">
                     <FormularioAutor />
                    <ListaAutor lista={this.state.lista}/> 
        </div>
                  
      </div>
    
            
        
        );
    }

}