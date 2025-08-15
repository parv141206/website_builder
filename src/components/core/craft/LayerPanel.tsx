import { useLayer } from "@craftjs/layers";
import React from "react";
export function SimpleLayerPanel() {
  const { id, name, actions } = useLayer((layer) => ({
    id: layer.id,
    name: layer.data.custom.displayName || layer.data.displayName,
    actions: layer.actions,
  }));
  console.log(name, id);
  return <div>SimpleLayerPanel</div>;
}
