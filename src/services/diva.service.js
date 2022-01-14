import { Diva, Overlay } from '@sheencity/diva-sdk';
import { WebRtcAdapter } from '@sheencity/diva-sdk-adapter';
import {
  Euler,
  EulerOrder,
  Matrix,
  rad2deg,
  Vector3,
} from '@sheencity/diva-sdk-math';

export class DivaService {
  /**
   * divaClient
   * @type {import('@sheencity/diva-sdk').DivaClient}
   */
  client;

  /**
   * @param container (HTMLElement) 视频加载的 dom 元素
   */
  async init(container) {
    const uri = 'http://127.0.0.1:3000';
    const apiKey = '<replace_your_api_key_here>';
    const adapter = new WebRtcAdapter(container, uri);
    const diva = new Diva({ apiKey, adapter });
    this.client = await diva.init();
  }

  /**
   * 应用指定场景名称的场景
   * @param name 场景名称
   * @param options 应用场景选项(可选)
   */
  async applySceneByName(name, options) {
    await this.client?.applyScene(name, options);
  }

  /**
   * 从模型组中取到指定名称的模型，无匹配返回 null
   * @param {TypedGroup<Model>} group
   * @param {string} name
   */
  getEntityFromGroup(group, name) {
    const models = Array.from(group);
    return models.find((model) => model.name === name) ?? null;
  }

  /**
   * 按序返回指定名称的所有模型
   * @param {string | string[]} name 一个或多个模型名称
   */
  async getEntitiesByName(name) {
    const names = typeof name === 'string' ? [name] : name;
    let models = await Promise.all(
      names.map((name) => this.client.getEntitiesByName(name))
    );
    models = models.flat();
    return names.map(
      (name) => models.find((model) => model.name === name) ?? null
    );
  }
  
  /**
   * 通过 groupPath 来获取楼层所有模型信息
   * @param {*} path
   * @returns
   */
  async getFloorInfoByName(path) {
    return await this.client.getModelGroupByGroupPath(path);;
  } 

  /**
   * 在 ModelGroup 中根据分类名称来获取对应的模型信息
   * @param {*} modelGroup
   * @param {*} category
   */
  getModelsFromGroupByCategory(modelGroup, category) {
    const rules = new Map([
      ['floor', /F/],
      ['toilet', /toilet/],
      ['smog', new RegExp('')],
    ]);
    const rule = rules.get(category);
    let models = [];
    modelGroup.forEach((model) => {
      if (rule.test(model.name)) {
        models.push(model);
      }
    });
    return models;
  }

  /**
   * 通过名称来获取实体
   * @param {*} name
   * @returns
   */
  async getEntityByName(name) {
    return await this.client.getEntitiesByName(name);
  }

  /**
   * 通过id获取模型
   */
  async getEntityById(id){
    return await this.client.getEntityById(id);
  }

  /**
   * 根据模型组设置显示隐藏
   * @param {string} group
   * @param {boolean} visible
   */
    async setEntityVisibleByGroup(group, visible) {
    await this.client?.request('UpdateEntityStatusByGroup', {
      group: group,
      visible: visible,
    });
  }

  /**
   * 设置实体的位移动画
   * @param {string} id 实体 ID
   * @param {number} duration 动画持续时间
   * @param {{ coord?: Vector3, rotation?: Vector3, scale?: Vector3 }} options
   */
  async setTransformAnimation(id, duration, options) {
    await this.client.request('SetTransformAnimation', {
      id: id,
      duration: duration,
      ...options,
    });
  }

  /**
   * 设置给定目录下除了覆盖物的模型组的显示隐藏
   * @param {string} group
   * @param {boolean} visible
   */
  async setEntityVisibleExceptOverlay(group, visible) {
    const models = await this.client.getEntitiesByGroupPath(group);
    const entities = models.filter((model) => !(model instanceof Overlay));
    await this.setEntityVisibleByArray(entities, visible);
  }

  /**
   * 设置模型数组的显示隐藏
   * @param {Model[]} array
   * @param {boolean} visible
   */
  async setEntityVisibleByArray(array, visible) {
    await this.client.request('UpdateEntityStatusByIds', {
      ids: array.map((model) => model.id),
      visible: visible,
    });
  }

  /**
   * 根据实体名设置显示隐藏
   * @param {string} name
   * @param {boolean} visible
   */
  async setEntityVisibleByName(name, visible) {
    const [entity] = await this.client.getEntitiesByName(name);
    entity.setVisibility(visible);
  }

  /**
   * 通过设置 poi 名称设置其背景颜色
   * @param {string} name poi 的名称
   * @param {[number, number, number]} color rgb 颜色值，各位数值值域 [0, 255]
   */
  async setPoiColorByName(name, color) {
    const { result } = await this.client.request('GetEntityByName', { name });
    await this.client.request('UpdateEntityProperty', {
      id: result.id,
      type: 'poi',
      property: { icon: 'camera', color },
    });
  }

  /**
   * 还原实体的渲染模式
   * @param {*} name
   */
  async setModelDefaultRenderModel(name) {
    const [model] = await this.getEntityByName(name);
    model.setRenderingStyleMode('default');
  }

  /**
   * 根据实体id设置实体的渲染模式
   * @param {*} id
   * @param {{mode,color,emission}} option  其他选项
   */
  async setModelRenderingStyleModeById(id, option) {
    await this.client.request('SetEntityRenderMode', {
      id: id,
      mode: option.mode,
      extend: {
        // 覆盖物类型的特有属性
        color: option.color, // 自发光颜色，[r,g,b,a]，颜色范围是0 ~ 255，以 alpha 值设置透明度
        emission: option.emission,
      },
    });
  }
  /**
   * 设置叠色高亮模式渲染样式
   */
  async setHighlightStyle(param){
    await this.client.request('SetHighlightStyle',param);
  }

  /**
   * 设置弹窗
   * @param {string} id 实体 ID
   * @param {string} url 链接
   * @param {{}} options 弹窗配置
   */
  async createWedWidget(id, url, options) {
    await this.client.request('CreateWebWidget', {
      entityId: id,
      widget: {
        url,
        ...options,
      },
    });
  }

  /**
   * 销毁弹窗
   * @param {string} id 实体 ID
   */
  async destroyWedWidget(id) {
    await this.client.request('DestroyWebWidget', {
      entityId: id,
    });
  }

  /**
   * 移除实体的位移动画
   * @param {string} id 实体 ID
   */
  async removeTransformAnimation(id) {
    await this.client.request('RemoveTransformAnimation', {
      id: id,
    });
  }

  /**
   * 根据模型组更新模型
   * @param {string} group 
   * @param {{}} option 
   */
  async updateEntityPropertyByGroup(group, option) {
    await this.client?.request('UpdateEntityStatusByGroup', {
      group: group,
      ...option,
    });
  }

  /**
   * 根据实体id更新标签覆盖物
   * @param {*} id
   * @param {{*}} option  其他选项
   */
  async updateEntityPropertyById(id, option) {
    await this.client.request('UpdateEntityProperty', {
      id: id,
      type: 'label',
      property: {
        // 覆盖物类型的特有属性
        title: option.title,
        content: option.content,
        color: option.color,
        opacity: option.opacity,
      },
    });
  }

  /**
   * 根据模型名称设置渲染模式并聚焦至该模型
   * @param {*} name
   * @param {*} distance
   * @param {*} pitch
   * @param {*} mode
   */
  async renderAndFocusOnModelByName(name, distance, pitch, mode) {
    const [model] = await this.getEntityByName(name);
    model.setRenderingStyleMode(mode);
    await this.client.request('FocusOnEntity', {
      id: model.id,
      distance,
      pitch,
    });
  }

  /**
   * 根据模型id设置自发光渲染模式
   */
  async renderEmissionModelById(id, mode, extend ){
    await this.client.request('SetEntityRenderMode', { id, mode, extend })
  }

  /**
   * 根据模型名称聚焦至模型
   * @param {string} name
   * @param {number} distance 距离（cm）
   * @param {number} pitch 角度
   */
  async focusOnModelByName(name, distance, pitch) {
    const [model] = await this.getEntityByName(name);
    model?.focus(distance, (pitch * Math.PI) / 180);
  }

  /**
   * 设置指定实体的渲染模式
   * @param {*} model
   * @param {*} title
   */

  async setModelRenderingStyleModeByTitle(model, title) {
    const rules = new Map([
      ['样式1', 'default'],
      ['样式2', 'alarm'],
      ['样式3', 'highlight'],
      ['default', 'default'],
    ]);
    const mode = rules.get(title);
    model.setRenderingStyleMode(mode);
  }

  chuck(array, size) {
    if (!array.length) return [];
    return [array.slice(0, size), ...this.chuck(array.slice(size), size)];
  }

  /**
   * 控制楼层抽屉拉出
   * @param {TypedGroup<Model>} floorModel 楼层模型组
   * @param {boolean} bool false 表示抽屉拉出，true 表示抽屉复位
   * @param {number} index 楼层号
   */
  async drawOutFloor(floorModel, bool, index) {
    // await this._translate(
    //   bool ? new Vector3(0, -3500, 0) : new Vector3(0, 3500, 0),
    //   floorModel,
    //   this.explodeState ? new Vector3(0, 0, index * 250) : new Vector3()
    // );
    if (!bool) {
      await this._translate(
        new Vector3(0, 3500, 0),
        floorModel,
        this.explodeState ? new Vector3(0, 0, index * 250) : new Vector3()
      );
    } else {
      try {
        await this._removeTransform(floorModel);
      } catch (e) {
        console.log('多余的一次清除动作');
      }
      await this._resetGroupCoord(floorModel);
    }
  }

  async _resetGroupCoord(group) {
    const metadata = [];
    for (const item of group) {
      metadata.push({
        method: 'UpdateEntityStatus',
        params: { id: item.id, coord: item.coord.tuple },
      });
    }
    await this._batchRequest(metadata);
  }
  async _removeTransform(group) {
    const metadata = [];
    for (const item of group) {
      metadata.push({
        method: 'RemoveTransformAnimation',
        params: { id: item.id },
      });
    }
    await this._batchRequest(metadata);
  }

  async _translate(delta, group, adjusting) {
    const metadata = [];
    const matrix = Matrix.Translation(delta);
    for (const item of group) {
      const { translation, scale, rotation } = item.transform
        .multiply(matrix)
        .decompose();
      const coord = translation.add(adjusting);
      const euler = Euler.FromQuaternion(rotation, EulerOrder.UE);
      metadata.push({
        method: 'SetTransformAnimation',
        params: {
          id: item.id,
          coord: coord.tuple,
          scale: scale.tuple,
          rotation: rad2deg(euler.angles),
          duration: 1,
          loop: false,
        },
      });
    }
    await this._batchRequest(metadata);
  }

  async _batchRequest(metadata) {
    const data = this.chuck(metadata, 50);
    await Promise.all(
      data.map((request) => this.client?.batchRequest(request))
    );
  }

  /**
   * 聚焦至坐标
   */
  async focusOnCoord(param){
    await this.client.request('FocusOnCoord', param);
  }

  /**
   * 通过名称播放漫游轨
   */
  async playCameraTrack(param){
    await this.client.playCameraTrack(param)
  }
}
