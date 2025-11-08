import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';

const source = `
## MarkdownPreview

> todo: React component preview markdown text.
`;

export function MyMarkdownEditor() {
    return (
        <MarkdownPreview source={source} style={{ padding: 16 }} />
    )
}

export default MyMarkdownEditor;