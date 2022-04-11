import { Spacing, Text, Title } from '@deversifi/dvf-shared-ui'
import { FunctionComponent } from 'react'
import styled from 'styled-components'

import { Container } from '../../components/common/presentation/Container'
import { Page } from '../../components/common/presentation/Page'
import BridgeFundsWidget from './BridgeFundsWidget'

const BridgeFunds: FunctionComponent = () => {
  return (
    <Page>
      <ContentWrapper>
        <TextWrapper direction='column'>
          <Title size='big'>
            Move funds seamlessly between Ethereum and StarkNet
          </Title>
          <Spacing size='24' />
          <Text>
            In order to send funds from Ethereum to StarkNet you need to have
            both an Ethereum wallet and a StarkNet wallet.
            <br />
            <br />
            Connect your Ethereum wallet to send funds to StarkNet.
            <br />
            <br />
            Why do I need a StarkNet wallet?
            <br />
            StarkNet handles accounts differently than Ethereum. Most popular
            Ethereum wallet providers (such as Metamask) do not yet support
            StarkNet.
            <br />
            <br />
            Why is my StarkNet address different? <br />
            You have created a new account on StarkNet, which is independent
            from your Ethereum address.
          </Text>
        </TextWrapper>
        <BridgeFundsWidget />
      </ContentWrapper>
    </Page>
  )
}

export default BridgeFunds

const ContentWrapper = styled(Container)`
  margin: 0 auto;
  max-width: 1050px;
  display: flex;
  width: 100%;
  padding-bottom: 128px;
  -webkit-filter: blur(0px);

  & > div:first-child {
    margin-right: 48px;
    flex: 2.3 0 0;
  }

  & > div:last-child {
    flex: 1 0 440px;
    max-width: 440px;
  }

  @media screen and (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    & > div {
      width: 100%;
    }

    & > div:first-child {
      margin-right: 0;
      order: 1
    }

    & > div:last-child {
      order: 0;
      margin-bottom: 40px;
    }
  }
`

const TextWrapper = styled(Container)`
  max-width: 500px;
  margin-right: 50px;
`
