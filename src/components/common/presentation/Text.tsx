import styled from 'styled-components'

interface TextProps {
    align?: string
}

interface TitleProps {
  $negative?: boolean
}

export const Text = styled.div<TextProps>`
    font-size: 16px;
    line-height: 24px;
    white-space: pre-line;
    text-align: ${({ align = 'left' }) => align};
    color: ${({ theme }) => theme.neutral100 };
    font-family: ${({ theme }) => theme.mainFont };
`

export const Title1 = styled.h1`
    font-size: 56px;
    line-height: 80px;
    font-weight: 300;
    color: ${({ theme }) => theme.defaultFontColor };
    font-family: ${({ theme }) => theme.mainFont };
    margin-bottom: 24px;
`

export const Title2 = styled.h2<TitleProps>`
    font-size: 32px;
    line-height: 40px;
    color: ${({ theme, $negative }) => $negative ? theme.negative600 :  theme.defaultFontColor };
    font-family: ${({ theme }) => theme.mainFont };
    margin-bottom: 36px;
`

export const Title3 = styled.h3`
    font-size: 24px;
    line-height: 32px;
    color: ${({ theme }) => theme.defaultFontColor };
    font-family: ${({ theme }) => theme.mainFont };
    margin-bottom: 24px;
`