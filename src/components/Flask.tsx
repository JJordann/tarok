import React from "react"

const axios = require('axios').default

export default class Flask extends React.Component {

    url = `http://localhost:5000/api`

    constructor(props: any) {
        super(props)

        this.state = {}
    }

    fetchData() {
        axios.get(`${this.url}/first`)
            .then((res: any) => this.setState(res.data))
    }

    componentDidMount() {
        this.fetchData()
    }


    render() {
        return (
            <div>
                { JSON.stringify(this.state) }
            </div>
        )
    }
}