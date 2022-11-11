import { Col, Row } from "@nextui-org/react"

const JobExecutions = (props: {
    executions: Array<{
        run_id: number,
        conclusion: string | null
    }>
}) => {

    return <>
        <Row
            style={{
                padding: "0px",
                paddingRight: "0px"
            }}>
            {
                props.executions.map(e => {
                    return <Col key={e.run_id}
                        style={{
                            backgroundColor: e.conclusion === "success" ? "#00cc33" : "#aa0000",
                            margin: '2px',
                            minWidth: '40px',
                            minHeight: '20px',
                        }}>
                    </Col>
                })
            }
        </Row>
    </>
}

export default JobExecutions;
