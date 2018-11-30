import React, { Component } from 'react';
import $ from 'jquery';
import inputCustomizado from './componentes/inputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from 'TratadorErros';

export default class FormularioLivro extends Component {
    construct(){
        super();
        this.state = {titulo:'',preco:'', autorId:''};
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPrecosetPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
    }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
          url:"htttp://localhost:8080/api/livro",
          contentType:'application/json',
          dataType:'JSON',
          type:'POST',
          data:JSON.stringify({titulo:'this.state.titulo',preco:'this.state.preco',autorId:'this.state.autorId'}),
          success:function(NovaListagem) {
            Pubsub.publish('atualiza-lista-libros',NovaListagem);
            this.setState({titulo:'',preco:'',autorId:''});
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
        setTitulo(evento) {
          this.setState({titulo:evento.target.value});
        }
        setPreco(evento) {
          this.setState({preco:evento.target.value});
        }
        setAutorId(evento){
          this.setState({autorId:evento.target.value});
        }


    render(){
        return(
            <div className="pure-form pure-form-aligned" onSubmit={enviaForm} method={post}>
                <form className="pure-form pure-form-aligned">
                    <inputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo}  label="Titulo" />
                    <inputCustomizado id="preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco} label="Preço"/>
                    <select name="AutorId" onChange={this.setAutorId}>
                        
                    </select>
            
            <div className="pure-control-group">
                <label></label>
             <button type="submit" className="pure-button pure-button-primary">Gravar</button>
            </div>
            </form>      
            </div>



        );
    }


}


export default class listaLvros extends Component {
    
     render(){
        return(

            <div>
                  <table className="pure-table">
                  <thead>
                  <tr>
                  <th>Titulo</th>
                  <th>Preco</th>
                  <th>Autor</th>
                  </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.lista.map(function(livro){
                        return (
                          <tr key={livro.id}>
                            <td>{livro.titulo} </td>
                            <td> {livro.preco} </td>
                            <td> {livro.autor} </td>
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


export default class LivroBox extends Component {
    construct(){
        super();
        this.state = {lista: []};


    }

    componentDidMount() {
        $.ajax({
          url:"http://localhost:8080/api/livros",
          dataType:'json',
          sucess:function(resposta){
            this.setState = {lista:resposta};
          }.bind(this)
    
        });
        
        PubSub.subscribe('atualiza-lista-livros',function(topico,Novalista){
            this.setState({lista:Novalista});

        }).bind(this);

    }



    render(){
        return(
            <div> 
                  <div className="header">
              
                    <h2>Formulario de lIVROS</h2>
                    </div>
                    <div className="content" id="content">
                     <FormularioLivro />
                    <listaLvros lista={this.state.lista}/> 
        </div>
                  
      </div> 
            


        );

    }



}