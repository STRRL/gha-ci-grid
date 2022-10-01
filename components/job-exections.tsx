import { Col, Container, Row } from "@nextui-org/react"

const JobExecutions = (props: {
    exectuions: Array<{
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
                props.exectuions.map(e => {
                    return <Col
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