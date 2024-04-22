import { Content } from "antd/es/layout/layout";
import MSRPGraph from "./MSRPGraph";
import MSRPDeltaGraph from "./MSRPDeltaGraph";
import { Col, Row } from "antd";

const MainArea: React.FC = () => {
  return (
    <Content className="content">
      <Row gutter={16}>
        <Col span={12}>
          <MSRPGraph />
        </Col>
        <Col span={12}>
          <MSRPDeltaGraph />
        </Col>
      </Row>
    </Content>
  );
};

export default MainArea;
