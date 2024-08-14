import React from "react";
import { Table } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


class Alunos extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            nome: '',
            email: '',
            alunos: [] // Inicialmente, alunos é um array vazio
        }
    }

    componentDidMount() {
        this.buscarAlunos();
    }

    buscarAlunos = () => {
        fetch("http://localhost:4000/alunos")
            .then(resposta => {
                if (!resposta.ok) {
                    throw new Error('Erro ao buscar os dados');
                }
                return resposta.json();
            })
            .then(dados => {
                this.setState({ alunos: dados });
            })
            .catch(error => {
                console.error('Erro ao buscar os dados:', error);
            });
    }

    deletarAluno = (id) => {
        fetch(`http://localhost:4000/alunos/${id}`, { method: 'DELETE' })
            .then(resposta => {
                if (!resposta.ok) {
                    throw new Error('Erro ao deletar aluno');
                }
                this.buscarAlunos(); // Atualiza a lista após exclusão
            })
            .catch(error => {
                console.error('Erro ao deletar aluno:', error);
            });
    }

    carregarDados = (id) => {
        fetch(`http://localhost:4000/alunos/${id}`, { method: 'GET' })
            .then(resposta => {
                if (!resposta.ok) {
                    throw new Error('Erro ao carregar dados do aluno');
                }
                return resposta.json();
            })
            .then(aluno => {
                this.setState({
                    id: aluno.id,
                    nome: aluno.nome,
                    email: aluno.email
                });
            })
            .catch(error => {
                console.error('Erro ao carregar dados do aluno:', error);
            });
    }

    salvarAluno = (aluno) => {
        const url = this.state.id ? `http://localhost:4000/alunos/${this.state.id}` : "http://localhost:4000/alunos/";
        const method = this.state.id ? 'PUT' : 'POST';

        fetch(url, { 
            method: method, 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(aluno) 
        })
            .then(resposta => {
                if (!resposta.ok) {
                    throw new Error('Erro ao salvar aluno');
                }
                return resposta.json();
            })
            .then(() => {
                this.buscarAlunos(); // Atualiza a lista após cadastro
                this.setState({ id: null, nome: '', email: '' }); // Limpa os campos do formulário
            })
            .catch(error => {
                console.error('Erro ao salvar aluno:', error);
            });
    }

    handleSubmit = (e) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário

        const aluno = {
            nome: this.state.nome,
            email: this.state.email
        };

        this.salvarAluno(aluno);
    }

    renderTabela() {
        const { alunos } = this.state;
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {alunos.length > 0 ? (
                        alunos.map(aluno => (
                            <tr key={aluno.id}>
                                <td>{aluno.id}</td>
                                <td>{aluno.nome}</td>
                                <td>{aluno.email}</td>
                                <td>
                                    <Button variant="secondary" onClick={() => this.carregarDados(aluno.id)}>Atualizar</Button>
                                    <Button variant="danger" onClick={() => this.deletarAluno(aluno.id)}>Excluir</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">Nenhum dado disponível</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        );
    }

    atualizaNome = (e) => {
        this.setState({ nome: e.target.value });
    }

    atualizaEmail = (e) => {
        this.setState({ email: e.target.value });
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>

                    <Form.Group className="mb-3">
                        <Form.Label>ID</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={this.state.id !== null ? this.state.id : ''} // Exibe o ID ou vazio se null
                            readOnly
                            style={{ backgroundColor: '#e9ecef', borderColor: '#000000', color: '#495057' }}  // Adiciona a classe CSS para o ID
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Digite o Nome do Aluno" 
                            value={this.state.nome} 
                            onChange={this.atualizaNome}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Digite o Email do Aluno" 
                            value={this.state.email} 
                            onChange={this.atualizaEmail}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        {this.state.id ? 'Atualizar' : 'Salvar'}
                    </Button>
                </Form>

                {this.renderTabela()}
            </div>
        );
    }
}

export default Alunos;
