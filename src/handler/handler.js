'use strict'

import BatchManager from 'hypernova/lib/utils/BatchManager';
import HelloWorld from '@/components/HelloWorld.vue';
import { renderVue } from 'hypernova-vue/server'
import Vue from 'vue'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
};

const assetManifest = CLIENT_MANIFEST;

const getComponent = async (_, context) => {
  const jsAssets = Object.keys(assetManifest).filter(assetName => assetName.endsWith('.js')).map(jsAsset => assetManifest[jsAsset]);
  const cssAssets = Object.keys(assetManifest).filter(assetName => assetName.endsWith('.css')).map(cssAsset => assetManifest[cssAsset]);
  context.returnMeta = {};
  if (jsAssets.length > 0) {
    context.returnMeta.scriptUrl = jsAssets[0];
  }
  if (cssAssets.length > 0) {
    context.returnMeta.styleUrl = cssAssets[0];
  }
  return renderVue(HelloWorld.name, Vue.extend(HelloWorld));
};

export const post = async (event) => {
  try {
    const config = { devMode: false, plugins: [], getComponent };
    const body = JSON.parse(event.body);
    const context = {}
    context[HelloWorld.name] = { name: HelloWorld.name, data: body };
    const manager = new BatchManager(null, null, context, config);
    await manager.render(HelloWorld.name);
    const renderResult = manager.getResult(HelloWorld.name);
    // Vue throws an error client side when attempting to hydrate when the html cotains spaces between elements.
    renderResult.html = renderResult.html.replace(/>[^<\S]</g, '><')
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(renderResult) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ message: error.message }) };
  }
};
