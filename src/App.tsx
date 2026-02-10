import { Typography, Button, Card, Space, message } from 'antd'
import { useQuery } from '@tanstack/react-query'

const { Title, Paragraph } = Typography

// 🔹 Fake query pour tester TanStack Query
const fetchHealthCheck = async (): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('PrimeBank API is reachable 🚀')
        }, 800)
    })
}

function App() {
    const [messageApi, contextHolder] = message.useMessage()

    const { data, isLoading } = useQuery({
        queryKey: ['health-check'],
        queryFn: fetchHealthCheck,
    })

    const showSuccessToast = () => {
        messageApi.success('Welcome to PrimeBank Frontend 👋')
    }

    const showErrorToast = () => {
        messageApi.error('Something went wrong ❌')
    }

    return (
        <>
            {contextHolder}

            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f5f7fa',
                }}
            >
                <Card
                    style={{ width: 420 }}
                    bordered={false}
                >
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Title level={2}>🏦 PrimeBank Frontend</Title>

                        <Paragraph>
                            Bienvenue sur le frontend de PrimeBank.
                            Cette page confirme que <strong>Ant Design</strong>,
                            <strong> TanStack Query</strong> et la configuration globale
                            fonctin.
                        </Paragraph>

                        <Paragraph>
                            <strong>Status :</strong>{' '}
                            {isLoading ? 'Checking…' : data}
                        </Paragraph>

                        <Space>
                            <Button type="primary" onClick={showSuccessToast}>
                                Show Success Toast
                            </Button>

                            <Button danger onClick={showErrorToast}>
                                Show Error Toast
                            </Button>
                        </Space>
                    </Space>
                </Card>
            </div>
        </>
    )
}

export default App
